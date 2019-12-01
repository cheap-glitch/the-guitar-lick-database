<?php

/**
 * routes/licks/suggest.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Randomly select licks similar to a specified lick
 */
$api->post('/licks/suggest', function(Request $request, Response $response, array $args)
{
	$db   = $this->get('medoo');
	$lick = $request->getParsedBody();
	$data = [];
	$try  = 0;

	$NB_RESULTS_NEEDED = 3;
	$CONDITIONS = [

		// First try
		[
			// Same type of scale, difficulty and tags
			'scale'      => $lick['scale'],
			'difficulty' => $lick['difficulty'],
			'tags'       => $lick['tags'],

			// At least on genre in common
			'genres[~]'  => $lick['genres'],
		],

		// Second try
		[
			// Same type of scale and difficulty
			'scale'      => $lick['scale'],
			'difficulty' => $lick['difficulty'],

			// At least one tag and one genre in common
			'tags[~]'    => $lick['tags'],
			'genres[~]'  => $lick['genres'],
		],

		// Third try
		[
			// Same type of scale
			'scale'      => $lick['scale'],

			// At least one tag in common
			'tags[~]'    => $lick['tags'],
		],

		// Fourth try
		[
			// At least one tag in common
			'tags[~]'    => $lick['tags'],
		],

		// As a last resort, take any lick
		[],
	];

	// Try to get some results, each time with less strict conditions
	while (count($data) < $NB_RESULTS_NEEDED)
	{
		$data = array_merge($data, $db->rand('licks', [
			'id',
			'tempo',
			'ts',
			'tex',
		], array_merge($CONDITIONS[$try], [

			// Exclude licks already selected
			'id[!]' => array_merge([(int) $lick['id']], array_map(fn($lick) => (int) $lick['id'], $data)),

			// Take only the number needed to complete the results
			'LIMIT' => $NB_RESULTS_NEEDED - count($data),
		])));

		$try++;
	}

	return json_encode_response($response, $data);
});
