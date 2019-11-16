<?php

/**
 * api/helpers.php
 */

use Psr\Http\Message\ResponseInterface as Response;

/**
 * Imbed data in JSON format in the response and return it
 */
function json_encode_response(Response $response, $data)
{
	$response->getBody()->write(json_encode($data));

	return $response->withHeader('Content-Type', 'application/json');
}

/**
 * Return the fields of a lick correctly formatted
 */
function lick_format(array $lick)
{
	// Only copy the fields that are present in the database table
	$result = array_filter(
		$lick,
		// @TODO : arrows!
		function($key)
		{
			return in_array($key, [
				'date',
				'variation',
				'tuning',
				'tonality',
				'scale',
				'tempo',
				'ts',
				'triplet',
				'difficulty',
				'artist',
				'tab',
				'notes',
			]);
		},
		ARRAY_FILTER_USE_KEY
	);

	// Copy the remaining fields while applying some transformation
	$result['tags']   = ' ' . implode(' ', $lick['tags'])   . ' ';
	$result['genres'] = ' ' . implode(' ', $lick['genres']) . ' ';

	return $result;
}
