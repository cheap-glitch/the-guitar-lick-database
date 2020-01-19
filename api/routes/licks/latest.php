<?php

/**
 * routes/licks/latest.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Return the n more recently added licks
 */
$api->get('/licks/latest/{number}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	$licks = $db->select('licks (lick)', [
		'[>]artists (artist)' => ['lick.artist' => 'id'],
	], [
		'lick.id',
		'lick.tuning',
		'lick.tonality',
		'lick.scale',
		'lick.tempo',
		'lick.ts',
		'lick.triplet',
		'lick.difficulty',
		'lick.artist',
		'lick.genres',
		'lick.tags',
		'lick.tex',

		// Name and URL of the associated artist
		'artist.url  (artistURL)',
		'artist.name (artistName)',
	], [
		'ORDER' => ['date' => 'DESC', 'id' => 'DESC'],
		'LIMIT' => (int) $args['number'],
	]);

	return json_encode_response($response, $licks);
});
