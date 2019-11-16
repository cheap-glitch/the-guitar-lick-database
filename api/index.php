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

/**
 * Modules
 * ----------------------------------------------------------------------------
 */

// Base
require('../vendor/autoload.php');
require('helpers.php');

// Global parameters
require('params.php');

// Production parameters
@include('production.php');

/**
 * Initialization
 * ----------------------------------------------------------------------------
 */

// Initialize the API
$container = new Container();
AppFactory::setContainer($container);
$api = AppFactory::create();
$api->addRoutingMiddleware();

// Set the error reporting level
error_reporting($PARAM_PHP_ERROR_REPORTING);
$api->addErrorMiddleware($PARAM_SLIM_DISPLAY_ERRORS, true, true);

// Add the database object to the API container
$container->set('medoo', new Medoo($PARAMS_DB_CONNECT));

// Add the middlewares
require('middlewares.php');

/**
 * Routing
 * ----------------------------------------------------------------------------
 */

// Respond correctly to CORS preflight requests
$api->options('/{routes:.+}', function (Request $request, Response $response) { return $response; });

// Declare the API routes
require('routes/artists/index.php');
require('routes/lick/browse.php');
require('routes/lick/count.php');
require('routes/lick/exists.php');
require('routes/lick/read.php');
require('routes/lick/suggest.php');
if (!$PARAM_PRODUCTION_MODE)
{
	require('routes/lick/add.php');
	require('routes/lick/edit.php');
	require('routes/source/grep.php');
}

// Catch-all route to serve a 404 Not Found page if none of the routes match
$api->map(['GET', 'POST', 'PUT'], '/{routes:.+}', function(Request $request, Response $response)
{
	// Handle using the default Slim page not found handler
	throw new HttpNotFoundException($request);
});

/**
 * Execution
 * ----------------------------------------------------------------------------
 */

// Run the API
$api->run();
