<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

	$app->get('/api/hello/{name}', 'hello');

	$app->options('/api/catalogue', 'optionsCatalogue' );

	// API Nécessitant un Jwt valide
	$app->get('/api/catalogue/{filtre}', 'getSearchCalatogue' );

	// API Nécessitant un Jwt valide
	$app->get('/api/catalogue', 'getCatalogue');

	// API Nécessitant un Jwt valide
	$app->get('/api/utilisateur', 'getUtilisateur');

	// APi d'authentification générant un JWT
	$app->post('/api/utilisateur/login', 'postLogin');

	$app->post('/api/utilisateur/signup', 'createUtilisateur');
	$app->put('/api/utilisateur/{id}', 'updateUtilisateur');
	$app->delete('/api/utilisateur/{id}', 'deleteUtilisateur');

	$app->options('/api/utilisateur', 'optionsUtilisateur');
	$app->options('/api/utilisateur/login', function (Request $request, Response $response, $args) {
		return addHeaders($response);
	});
	$app->options('/api/utilisateur/{id}', function (Request $request, Response $response, $args) {
		return addHeaders($response);
	});


	$app->post('/api/cartes', 'createCarte');
	$app->put('/api/cartes/{id}', 'updateCarte');
	$app->delete('/api/cartes/{id}', 'deleteCarte');
	$app->get('/api/cartes', 'getCartesByUtilisateur');