<?php

/**
 * routes/lick/edit.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Edit the infos of a lick in the database
 */
$api->put('/lick/edit/{id}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');
	$db->update('lick', lick_format($request->getParsedBody()), ['id' => (int) $args['id']]);

	return $response->withStatus(200);
});
