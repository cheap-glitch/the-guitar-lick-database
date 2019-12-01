<?php

/**
 * api/index.php
 */

use DI\Container;
use Medoo\Medoo;
use Slim\Factory\AppFactory;
use Slim\Exception\HttpNotFoundException;
use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

require('../vendor/autoload.php');
require('params.dev.php');
require('helpers.php');

/**
 * Initialization
 * ----------------------------------------------------------------------------
 */

error_reporting($PARAM_PHP_ERROR_REPORTING);

// Initialize the API
$container = new Container();
AppFactory::setContainer($container);
$api = AppFactory::create();

// Add the Medoo database object to the API container
$container->set('medoo', new Medoo($PARAMS_DB_CONNECT));

/**
 * Middlewares
 * ----------------------------------------------------------------------------
 */

// Add the basic middlewares
$api->addBodyParsingMiddleware();
$api->addRoutingMiddleware();
$api->addErrorMiddleware($PARAM_SLIM_DISPLAY_ERRORS, true, true);

// In production, add a middleware to check that every incoming request is made through XHR
if ($PARAM_PRODUCTION_MODE)
{
	$api->add(function(Request $request, RequestHandler $handler)
	{
		// Check for 'Access-Control-Request-Headers' too, in order to allow CORS preflight request to go through correctly
		$validRequest = strcasecmp($request->getHeaderLine('X-Requested-With'),		        'XMLHttpRequest') === 0
			     || strcasecmp($request->getHeaderLine('Access-Control-Request-Headers'), 'X-Requested-With') === 0;

		if (!$validRequest)
		{
			$response = new Slim\Psr7\Response();
			$response->getBody()->write('Access denied!');

			return $response->withStatus(403);
		}

		return $handler->handle($request);
	});
}

/**
 * Routing
 * ----------------------------------------------------------------------------
 */

// Respond correctly to CORS preflight requests
$api->options('/{routes:.+}', function (Request $request, Response $response) { return $response; });

// Declare the API routes
require('routes/artists/index.php');
require('routes/licks/browse.php');
require('routes/licks/count.php');
require('routes/licks/exists.php');
require('routes/licks/read.php');
require('routes/licks/suggest.php');
if (!$PARAM_PRODUCTION_MODE)
{
	require('routes/licks/add.php');
	require('routes/licks/edit.php');
	require('routes/sources/grep.php');
}

// Add a catch-all route to serve a 404 Not Found page if none of the routes match
$api->map(['GET', 'POST', 'PUT'], '/{routes:.+}', function(Request $request, Response $response)
{
	// Handle using the default Slim page not found handler
	throw new HttpNotFoundException($request);
});

/**
 * Execution
 * ----------------------------------------------------------------------------
 */

$api->run();
