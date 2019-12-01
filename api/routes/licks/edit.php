<?php

/**
 * routes/licks/edit.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Edit the infos of a lick in the database
 */
$api->put('/licks/edit/{id}', function(Request $request, Response $response, array $args)
{
	$db     = $this->get('medoo');
	$params = $request->getParsedBody();
	$lick   = lick_format($params);

	// Create a new source if needed
	$lick['source'] = source_insert($db, $params) ?: $lick['source'];

	// Edit the lick in the database
	$db->update('licks', $lick, ['id' => (int) $args['id']]);

	return $response->withStatus(200);
});
