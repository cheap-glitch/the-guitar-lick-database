<?php

/**
 * routes/updates/index.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Return the n most recent updates (or all of them if 'number' is 0)
 */
$api->get('/updates/{number}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');
	$nb = (int) $args['number'];

	$updates = $db->select('updates', [
		'id',
		'date',
		'title',
		'contents',
	],
	array_merge(
		['ORDER' => ['date' => 'DESC']],
		$nb ? ['LIMIT' => $nb] : []
	));

	return json_encode_response($response, $updates);
});
