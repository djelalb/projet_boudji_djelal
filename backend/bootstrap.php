<?php

use Doctrine\ORM\Tools\Setup;
use Doctrine\ORM\EntityManager;
use Dotenv\Dotenv;

date_default_timezone_set('America/Lima');
require_once "vendor/autoload.php";

// Charge les variables d'environnement
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$isDevMode = true;
$config = Setup::createYAMLMetadataConfiguration([__DIR__ . "/config/yaml"], $isDevMode);

$conn = [
    'host' => $_ENV['DB_HOST'],
    'driver' => 'pdo_pgsql',
    'user' => $_ENV['DB_USER'],
    'password' => $_ENV['DB_PASSWORD'],
    'dbname' => $_ENV['DB_NAME'],
    'port' => $_ENV['DB_PORT'],
    'sslmode' => $_ENV['SSL_MODE'],
];


try {
    $entityManager = EntityManager::create($conn, $config);
} catch (\Exception $e) {
    echo "Erreur lors de l'initialisation de l'EntityManager : " . $e->getMessage();
    exit(1);
}
