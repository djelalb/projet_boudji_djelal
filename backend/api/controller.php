<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

	function optionsCatalogue (Request $request, Response $response, $args) {
	    
	    // Evite que le front demande une confirmation à chaque modification
	    $response = $response->withHeader("Access-Control-Max-Age", 600);
	    
	    return addHeaders ($response);
	}

	function hello(Request $request, Response $response, $args) {
	    $array = [];
	    $array ["nom"] = $args ['name'];
	    $response->getBody()->write(json_encode ($array));
	    return $response;
	}

	function loadProducts() {
		$filePath = __DIR__ . '/../assets/mock/products.json';
		if (file_exists($filePath)) {
			$jsonContent = file_get_contents($filePath);
			return json_decode($jsonContent, true);
		} else {
			return [];
		}
	}	
	
	function getSearchCatalogue(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$filter = $args['filtre'] ?? '';
			$produitsRepository = $entityManager->getRepository(\Entity\Produits::class);
			
			$qb = $produitsRepository->createQueryBuilder('p');
			$qb->where('LOWER(p.name) LIKE LOWER(:filter)')
			   ->setParameter('filter', '%' . $filter . '%');
			
			$produits = $qb->getQuery()->getResult();
			
			$data = array_map(function($produit) {
				return [
					'id' => $produit->getId(),
					'name' => $produit->getName(),
					'price' => $produit->getPrice(),
					'category' => $produit->getCategory(),
					'image' => $produit->getImage()
				];
			}, $produits);
			
			$response->getBody()->write(json_encode($data));
		} catch (\Exception $e) {
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
		}
		return addHeaders($response);
	}	

	// API Nécessitant un Jwt valide
	function getCatalogue(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$produitsRepository = $entityManager->getRepository(\Entity\Produits::class);
			$produits = $produitsRepository->findAll();
			
			if (!empty($produits)) {
				$data = array_map(function($produit) {
					return [
						'id' => $produit->getId(),
						'name' => $produit->getName(),
						'price' => $produit->getPrice(),
						'category' => $produit->getCategory(),
						'image' => $produit->getImage()
					];
				}, $produits);
				
				$response->getBody()->write(json_encode($data));
			} else {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Aucun produit trouvé']));
			}
		} catch (\Exception $e) {
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
		}
		return addHeaders($response);
	}	

	function optionsUtilisateur (Request $request, Response $response, $args) {
	    
	    // Evite que le front demande une confirmation à chaque modification
	    $response = $response->withHeader("Access-Control-Max-Age", 600);
	    
	    return addHeaders ($response);
	}

	// API Nécessitant un Jwt valide
	function getUtilisateur (Request $request, Response $response, $args) {
	    global $entityManager;
	    
	    $payload = getJWTToken($request);
	    $login  = $payload->userid;
	    
	    $userRepository = $entityManager->getRepository('user');
	    $user = $userRepository->findOneBy(array('login' => $login));
	    if ($user) {
		$data = array('nom' => $user->getNom(), 'prenom' => $user->getPrenom());
		$response = addHeaders ($response);
		$response = createJwT ($response);
		$response->getBody()->write(json_encode($data));
	    } else {
		$response = $response->withStatus(404);
	    }

	    return addHeaders ($response);
	}

	// APi d'authentification générant un JWT
	function postLogin (Request $request, Response $response, $args) {   
	    global $entityManager;
	    try {
		// Log début de la fonction
		error_log("Début postLogin");
		
		// Vérification du body
		$body = $request->getParsedBody();
		error_log("Body reçu : " . json_encode($body));
		
		// Si le body est null, essayons de le lire directement
		if ($body === null) {
			$body = json_decode($request->getBody()->getContents(), true);
			error_log("Body après json_decode : " . json_encode($body));
		}
		
		$login = $body['login'] ?? "";
		$pass = $body['pass'] ?? "";
		
		error_log("Login: " . $login . ", Password: " . $pass);

		// Vérification de l'entity manager
		if (!$entityManager) {
			throw new Exception("EntityManager non initialisé");
		}
		
		try {
			$userRepository = $entityManager->getRepository('Entity\Utilisateurs');
			error_log("Repository obtenu");
			
			$user = $userRepository->findOneBy(['login' => $login, 'pass' => $pass]);
			error_log("Recherche utilisateur effectuée");
			
			if ($user) {
				error_log("Utilisateur trouvé");
				$response = addHeaders($response);
				$response = createJwT($response);
				$data = array('nom' => $user->getNom(), 'prenom' => $user->getPrenom());
				$response->getBody()->write(json_encode($data));
			} else {          
				error_log("Utilisateur non trouvé");
				$response = $response->withStatus(403);
				$response->getBody()->write(json_encode(['error' => 'Identifiants invalides']));
			}
		} catch (Exception $e) {
			error_log("Erreur Doctrine : " . $e->getMessage());
			throw $e;
		}
		
	    } catch (Exception $e) {
		error_log("Erreur finale : " . $e->getMessage());
		$response = $response->withStatus(500);
		$response->getBody()->write(json_encode([
			'error' => 'Erreur serveur',
			'message' => $e->getMessage(),
			'trace' => $e->getTraceAsString()
		]));
	    }

	    return addHeaders($response);
	}

