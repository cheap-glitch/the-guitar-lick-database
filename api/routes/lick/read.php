<?php

/**
 * routes/lick/read.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Fetch the data of a single lick
 */
$api->get('/lick/read/{id}', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	// Fetch all the fields of the lick
	$data = $db->get('lick', [

		// Fetch the associated artist (if there is one)
		'[>]artist' => ['artist' => 'id'],

		// Fetch the associated source (if there is one)
		'[>]source' => ['source' => 'id'],

		// If the lick is a variation, fetch the original
		'[>]lick (original)' => ['variation' => 'id'],

	], [
		'lick.id',
		'lick.date',
		'lick.variation',
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
		'lick.tab',
		'lick.notes',

		// Source
		'source' => [
			'source.type',
			'source.name',
			'source.author',
			'source.url',
			'lick.timestamp',
		],

		// Name and URL of the associated artist
		'artist.url     (artistURL)',
		'artist.name    (artistName)',

		// Original lick
		'original.id    (originalId)',
		'original.tempo (originalTempo)',
		'original.ts    (originalTs)',
		'original.tab   (originalTab)',
	], [
		'lick.id' => (int) $args['id'],
	]);

	// Return a 404 if the lick doesn't exist
	if (empty($data)) return $response->withStatus(404);

	// Fetch the variations (if there are some)
	$data['variations'] = $db->select('lick',
		[
			'id',
			'tempo',
			'ts',
			'tab',
		], [
			'variation' => (int) $data['id'],
			'ORDER'     => ['id' => 'DESC'],
		]);

	// Pre-parse some of the fields for easier use
	$data['tempo']  = (int) $data['tempo'];
	$data['tags']   = explode(' ', trim($data['tags']));
	$data['genres'] = explode(' ', trim($data['genres']));

	return json_encode_response($response, $data);
});
