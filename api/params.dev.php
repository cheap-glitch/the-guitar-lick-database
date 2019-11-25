<?php

/**
 * api/params.dev.php
 */

$PARAM_PRODUCTION_MODE = false;

/**
 * Error reporting
 */
$PARAM_PHP_ERROR_REPORTING = E_ALL;
$PARAM_SLIM_DISPLAY_ERRORS = true;

/**
 * Connection to the database
 */
$PARAMS_DB_CONNECT = [
	'database_type' => 'mysql',

	'server'	=> 'localhost',
	'database_name' => 'tgld',
	'username'	=> 'root',
	'password'	=> 'why so serious',

	'charset'	=> 'utf8',
	'collation'	=> 'utf8_general_ci',

	// Command to execute upon connexion
	'command'	=> ["SET NAMES 'UTF8'"],

	// PDO options
	'option'	=> [
		// Throw an exception when an error occurs
		PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
	]
];
