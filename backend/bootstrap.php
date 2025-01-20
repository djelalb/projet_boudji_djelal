<?php
	use Doctrine\ORM\Tools\Setup;
	use Doctrine\ORM\EntityManager;
	date_default_timezone_set('America/Lima');
	require_once "vendor/autoload.php";
	$isDevMode = true;
	$config = Setup::createYAMLMetadataConfiguration(array(__DIR__ . "/config/yaml"), $isDevMode);
	$conn = array(
	'host' => 'dpg-cu0e9ehu0jms73d01jh0-a.oregon-postgres.render.com',
	'driver' => 'pdo_pgsql',
	'user' =>'cnam_postgree_djelal_user',
	'password' => 'sJ5UIJbK4dyihQxB16SBgXwQKDdxhACT',
	'dbname' => 'cnam_postgree_djelal',
	'port' => '5432',
	'sslmode' => 'allow'
	);


	$entityManager = EntityManager::create($conn, $config);
