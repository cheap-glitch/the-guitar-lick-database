<?php

/**
 * routes/source/grep.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Grep all the sources according to their names
 */
$api->post('/sources/grep', function(Request $request, Response $response)
{
	$db     = $this->get('medoo');
	$params = array_filter($request->getParsedBody(), fn($key) => $key === 'name', ARRAY_FILTER_USE_KEY);

	$data = !empty($params)
		? $db->select('sources', ['sources.id', 'sources.name'], ['sources.name[~]' => $params['name']])
		: [];

	return json_encode_response($response, $data);
});
