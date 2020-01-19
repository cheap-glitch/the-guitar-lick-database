<?php

/**
 * routes/updates/index.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Return the n most recent updates
 */
$api->get('/updates/{number}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	$updates = $db->select('updates', [
		'id',
		'date',
		'title',
		'contents',
	], [
		'ORDER' => ['date' => 'DESC'],
		'LIMIT' => (int) $args['number'],
	]);

	return json_encode_response($response, $updates);
});
