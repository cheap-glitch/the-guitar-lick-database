<?php

/**
 * routes/artists/index.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Return all the artists
 */
$api->get('/artists', function(Request $request, Response $response)
{
	$db = $this->get('medoo');

	// Fetch all the artists and their data
	$artists = $db->select('artists', [
		'id',
		'url',
		'name',
	], [
		'ORDER' => ['name']
	]);

	return json_encode_response($response, $artists);
});
