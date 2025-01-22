<?php

use Tuupola\Middleware\JwtAuthentication;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use \Firebase\JWT\JWT;

const JWT_SECRET = "TP-CNAM";

// Fonction pour extraire le token JWT du header Authorization
function getJWTToken($request) {
    $payload = str_replace("Bearer ", "", $request->getHeader('Authorization')[0]);
    $token = JWT::decode($payload, JWT_SECRET, array("HS256"));
    return $token; 
}

// Fonction pour créer un token JWT
function createJwt(Response $response): Response {
    $userid = "djelal";
    $issuedAt = time();
    $expirationTime = $issuedAt + 1200; // JWT valide pendant 20 minutes
    $payload = [
        'userid' => $userid,
        'iat' => $issuedAt,
        'exp' => $expirationTime
    ];
    $token_jwt = JWT::encode($payload, JWT_SECRET, "HS256");
    return $response->withHeader("Authorization", "Bearer {$token_jwt}");
}

// Middleware de validation du JWT
$options = [
    "attribute" => "token",
    "header" => "Authorization",
    "regexp" => "/Bearer\s+(.*)$/i",
    "secure" => false,
    "algorithm" => ["HS256"],
    "secret" => JWT_SECRET,
    "path" => ["/api"], // Applique le middleware à toutes les routes /api
    "ignore" => [
        "/api/hello",
        "/api/utilisateur/login",
        "/api/utilisateur/signup",
        "/api/catalogue",
        "/api/catalogue/{filtre}"
    ], // Routes accessibles sans JWT
    "error" => function ($response, $arguments) {
        $data = ['error' => 'JWT non valide'];
        $response = $response->withStatus(401)
            ->withHeader("Content-Type", "application/json");
        $response->getBody()->write(json_encode($data));
        return $response;
    }
];

// Ajout du middleware au framework Slim
$app->add(new JwtAuthentication($options));

// Fonction pour ajouter les headers CORS et de contenu
function addHeaders(Response $response): Response {
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Expose-Headers', 'Authorization');
}

$app->addBodyParsingMiddleware();
