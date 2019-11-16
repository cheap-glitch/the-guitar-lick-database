<?php

/**
 * routes/lick/exists.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Check if a lick exists in the database
 */
$api->get('/lick/exists/{id}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	return json_encode_response($response, $db->has('lick', ['id' => (int) $args['id']]));
});
