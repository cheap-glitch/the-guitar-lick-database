<?php

/**
 * routes/licks/count.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Return the total number of licks in the database
 */
$api->get('/licks/count', function(Request $request, Response $response, array $args)
{
	return json_encode_response($response, $this->get('medoo')->count('licks'));
});
