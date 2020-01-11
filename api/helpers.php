<?php

/**
 * api/helpers.php
 */

use Psr\Http\Message\ResponseInterface as Response;

/**
 * Insert a new source in the database if needed and return its ID
 */
function source_insert($db, array $params)
{
	if ($params['source']['sid'] == 0 && !empty($params['source']['name']))
	{
		$db->insert('sources', [
			'type'   => $params['source']['type'],
			'name'   => $params['source']['name'],
			'author' => $params['source']['author'],
			'url'    => $params['source']['url'],
		]);

		return $db->id();
	}

	return 0;
}

/**
 * Return the fields of a lick correctly formatted
 */
function lick_format(array $lick)
{
	// Only copy the fields that are present in the database table
	$result = array_filter(
		$lick,
		fn($key) => in_array($key, [
			'date',
			'original',
			'tuning',
			'tonality',
			'scale',
			'tempo',
			'ts',
			'triplet',
			'difficulty',
			'artist',
			'tex',
			'notes',
			'timestamp',
		]),
		ARRAY_FILTER_USE_KEY
	);

	// Copy the remaining fields while applying some transformation
	$result['tags']   = ' ' . implode(' ', $lick['tags'])   . ' ';
	$result['genres'] = ' ' . implode(' ', $lick['genres']) . ' ';
	$result['source'] = $lick['source']['sid'];

	return $result;
}

/**
 * Embed the data in JSON format inside the response and return it
 */
function json_encode_response(Response $response, $data)
{
	$response->getBody()->write(json_encode($data));

	return $response->withHeader('Content-Type', 'application/json');
}
