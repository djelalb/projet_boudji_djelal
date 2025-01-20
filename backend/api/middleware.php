<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tuupola\Middleware\HttpBasicAuthentication;
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
    $expirationTime = $issuedAt + 600; // JWT valide pendant 10 minutes
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
    "path" => ["/api"],
    "ignore" => ["/api/hello", "/api/utilisateur/login"],
    "error" => function ($response, $arguments) {
        $data = ['error' => 'JWT non valide'];
        $response = $response->withStatus(401);
        return $response->withHeader("Content-Type", "application/json")->write(json_encode($data));
    }
];

// Fonction pour ajouter les headers CORS et de contenu
function addHeaders(Response $response): Response {
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withHeader('Access-Control-Allow-Origin', '*')
        ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->withHeader('Access-Control-Expose-Headers', 'Authorization');
}

$app->add(new Tuupola\Middleware\JwtAuthentication($options));


