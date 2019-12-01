<?php

/**
 * routes/licks/browse.php
 */

use Psr\Http\Message\ResponseInterface      as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

/**
 * Select all the licks corresponding to the search parameters
 */
$api->post('/licks/browse', function(Request $request, Response $response, array $args)
{
	$db = $this->get('medoo');

	// Define all the columns that can be used to select entries (JSON key => [database column, test type])
	$model = [
		'tuning'        => ['column' => 'tuning',      'test' => '='],
		'tonality'      => ['column' => 'tonality',    'test' => '='],
		'scale'         => ['column' => 'scale',       'test' => '='],
		'timeSignature' => ['column' => 'ts',          'test' => '='],
		'tempo'         => ['column' => 'tempo',       'test' => '='],
		'difficulty'    => ['column' => 'difficulty',  'test' => '='],
		'artist'        => ['column' => 'artist',      'test' => '='],
		'genre'         => ['column' => 'genres',      'test' => '~'],
		'tags'          => ['column' => 'tags',        'test' => '!'],
	];

	// Filter the search parameters to remove wildcard, empty values and unsupported keys
	$params = array_filter(
			$request->getParsedBody(),
			function($value, $key) use ($model)
			{
				return (($value !== '')
				    AND ($value !== 'any')
				    AND ($value !== 'unchecked')
				    AND (key_exists($key, $model)));
			},
			ARRAY_FILTER_USE_BOTH
		);

	// Build the WHERE clause
	foreach ($params as $key => $value)
	{
		$column = $model[$key]['column'];

		switch ($model[$key]['test'])
		{
			case '=': $where[$column] = $value;        break;
			case '~': $where[$column. '[~]'] = $value; break;
			case '!': /* Ignore the value */           break;
		}
	}

	// Build the filters for the tags
	if (isset($params['tags']))
	{
		$included = array_filter($params['tags'], function($state) { return ($state === 'included'); });
		$excluded = array_filter($params['tags'], function($state) { return ($state === 'excluded'); });

		if (!empty($included)) $where['tags[~]']  = ['AND' => array_keys($included)];
		if (!empty($excluded)) $where['tags[!~]'] = ['AND' => array_keys($excluded)];
	}

	// Set the ordering
	$where['ORDER'] = [
		'id' => 'DESC',
	];

	// Fetch the licks
	$data = $db->select('licks (lick)', [
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

	], $where);

	return json_encode_response($response, $data);
});
