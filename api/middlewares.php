<?php

/**
 * api/middlewares.php
 */

use Psr\Http\Message\ResponseInterface	    as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;

/**
 * Add a middleware to parse JSON-encoded request bodies
 */
$api->add(function(Request $request, RequestHandler $handler)
{
	// If the content of the body is JSON
	if (stristr($request->getHeaderLine('Content-Type'), 'application/json'))
	{
		$contents = json_decode(file_get_contents('php://input'), true);

		if (json_last_error() === JSON_ERROR_NONE)
			$request = $request->withParsedBody($contents);
	}

	return $handler->handle($request);
});

/**
 * In production, add a middleware to check that every incoming request is made through XHR
 */
if ($PARAM_PRODUCTION_MODE)
{
	$api->add(function(Request $request, RequestHandler $handler)
	{
		// Check for 'Access-Control-Request-Headers' too, in order to allow CORS preflight request to go through correctly
		$validRequest = (strcasecmp($request->getHeaderLine('X-Requested-With'),	       'XMLHttpRequest')   === 0 OR
				 strcasecmp($request->getHeaderLine('Access-Control-Request-Headers'), 'X-Requested-With') === 0);

		if (!$validRequest)
		{
			$response = new Slim\Psr7\Response();
			$response->getBody()->write('Access denied!');

			return $response->withStatus(403);
		}

		return $handler->handle($request);
	});
}
