<?php

/**
 * routes/source/grep.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Grep all the sources according to their names
 */
$api->post('/source/grep', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	$params = array_filter(
		$request->getParsedBody(),
		// @TODO : =>
		function($key) { return $key === 'name'; },
		ARRAY_FILTER_USE_KEY
	);

	$data = !empty($params) ? $db->select('source', ['source.id', 'source.name'], ['source.name[~]' => $params['name']]) : [];

	return json_encode_response($response, $data);
});
