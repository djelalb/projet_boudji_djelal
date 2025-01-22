<?php

	use Slim\Factory\AppFactory;
	use Selective\BasePath\BasePathMiddleware;

	require __DIR__ . '/../vendor/autoload.php';
	require_once __DIR__ . '/../bootstrap.php';

	$app = AppFactory::create();

	$app->addRoutingMiddleware();
	$app->add(new BasePathMiddleware($app));
	$app->addErrorMiddleware(true, true, true);

	require_once __DIR__ . '/middleware.php';
	require_once __DIR__ . '/controller.php';
	require_once __DIR__ . '/route.php';

	// Run app
	$app->run();
