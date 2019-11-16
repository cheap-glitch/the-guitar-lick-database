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
	if ($params['source']['id'] == 0 && !empty($params['source']['name']))
	{
		$db->insert('source', [
			'type'	 => $params['source']['type'],
			'name'	 => $params['source']['name'],
			'author' => $params['source']['author'],
		]);

		// Link the lick to the newly created source
		$lick['source'] = $db->id();
	}

	// If an existing source is specified, link the lick to it
	if ($params['source']['id'] != 0) $lick['source']    = $params['source']['id'];
	if ($params['timestamp'] != 0)	  $lick['timestamp'] = $params['timestamp'];

	// Add the lick to the database
	$db->insert('lick', array_merge(['date' => date('Y-m-d')], $lick));

	return $response->withStatus(201);
});
