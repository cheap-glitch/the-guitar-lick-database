<?php

/**
 * routes/lick/add.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Add a new lick into the database
 */
$api->post('/lick/add', function(Request $request, Response $response, array $args)
{
	$db	= $this->get('medoo');
	$params = $request->getParsedBody();
	$lick	= lick_format($params);

	// Create a new source if needed
	$lick['source'] = source_insert($db, $params);

	// Insert the new lick into the database
	$db->insert('lick', array_merge(['date' => date('Y-m-d')], $lick));

	return $response->withStatus(201);
});
