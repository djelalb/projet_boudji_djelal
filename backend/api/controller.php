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
			$data = array(
				'id' => $user->getId(),
				'login' => $user->getLogin(),
				'nom' => $user->getNom(),
				'prenom' => $user->getPrenom(),
				'email' => $user->getEmail(),
				'adresse' => $user->getAdresse(),
				'telephone' => $user->getTelephone()
			);
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
			error_log("Début postLogin");

			$body = $request->getParsedBody();
			error_log("Body reçu : " . json_encode($body));

			if ($body === null) {
				$body = json_decode($request->getBody()->getContents(), true);
				error_log("Body après json_decode : " . json_encode($body));
			}
			$login = $body['login'] ?? "";
			$password = $body['password'] ?? "";

			error_log("Login: " . $login . ", Password: " . $password);

			if (!$entityManager) {
				throw new Exception("EntityManager non initialisé");
			}

			try {
				$userRepository = $entityManager->getRepository('Entity\Utilisateurs');
				error_log("Repository obtenu");

				$user = $userRepository->findOneBy(['login' => $login, 'password' => $password]);
				error_log("Recherche utilisateur effectuée");

				if ($user) {
					error_log("Utilisateur trouvé");

					// Création du JWT
					$response = addHeaders($response);
					$response = createJwt($response); 

					// Prépare les données à renvoyer
					$userData = array(
						'id' => $user->getId(),
						'login' => $user->getLogin(),
						'nom' => $user->getNom(),
						'prenom' => $user->getPrenom(),
						'email' => $user->getEmail(),
						'adresse' => $user->getAdresse(),
						'telephone' => $user->getTelephone()
					);
					$data = array(
						'token' => str_replace("Bearer ", "", $response->getHeader('Authorization')[0]),
						'user' => $userData
					);

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

	function createUtilisateur(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$data = $request->getParsedBody();
			$utilisateur = new \Entity\Utilisateurs();
			$utilisateur->setNom($data['nom']);
			$utilisateur->setPrenom($data['prenom']);
			$utilisateur->setLogin($data['login']);
			$utilisateur->setPassword($data['password']);
			$utilisateur->setEmail($data['email']);
			$utilisateur->setAdresse($data['adresse']);
			$utilisateur->setTelephone($data['telephone']);
			$entityManager->persist($utilisateur);
			$entityManager->flush();

			$response->getBody()->write(json_encode(['message' => 'Utilisateur créé avec succès']));
			return addHeaders($response);
		} catch (\Exception $e) {
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}

	function updateUtilisateur(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$id = $args['id'];
			$data = $request->getParsedBody();
			$utilisateur = $entityManager->find('Entity\Utilisateurs', $id);
			if (!$utilisateur) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Utilisateur non trouvé']));
				return addHeaders($response);
			}

			// Mettre à jour les propriétés de l'utilisateur uniquement si elles existent dans les données envoyées
			$utilisateur->setNom($data['nom'] ?? $utilisateur->getNom());
			$utilisateur->setPrenom($data['prenom'] ?? $utilisateur->getPrenom());
			$utilisateur->setLogin($data['login'] ?? $utilisateur->getLogin());
			$utilisateur->setPassword($data['password'] ?? $utilisateur->getPassword());
			$utilisateur->setEmail($data['email'] ?? $utilisateur->getEmail());
			$utilisateur->setAdresse($data['adresse'] ?? $utilisateur->getAdresse());
			$utilisateur->setTelephone($data['telephone'] ?? $utilisateur->getTelephone());

			$entityManager->flush();

			$response->getBody()->write(json_encode(['message' => 'Utilisateur mis à jour avec succès']));
			return addHeaders($response);

		} catch (\Exception $e) {
			error_log("Erreur lors de la mise à jour : " . $e->getMessage());
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}

	function deleteUtilisateur(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$id = $args['id'];
			$utilisateur = $entityManager->find('Entity\Utilisateurs', $id);
			if (!$utilisateur) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Utilisateur non trouvé']));
				return addHeaders($response);
			}

			$entityManager->remove($utilisateur);
			$entityManager->flush();

			$response->getBody()->write(json_encode(['message' => 'Utilisateur supprimé avec succès']));
			return addHeaders($response);
		} catch (\Exception $e) {
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}

	function createCarte(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$data = $request->getParsedBody();
			$utilisateur = $entityManager->getRepository('Entity\Utilisateurs')->find($data['utilisateur_id']);
			if (!$utilisateur) {
				throw new \Exception("Utilisateur non trouvé");
			}

			$carte = new \Entity\CartesCredit();
			$carte->setUtilisateur($utilisateur);
			$carte->setNumeroCarte($data['numero_carte']);
			$carte->setExpirationDate(new \DateTime($data['expiration_date']));
			$carte->setTitulaire($data['titulaire']);
			$carte->setCryptogramme($data['cryptogramme']);

			$entityManager->persist($carte);
			$entityManager->flush();

			$response->getBody()->write(json_encode(['message' => 'Carte créée avec succès']));
			return addHeaders($response);
		} catch (\Exception $e) {
			error_log("Erreur lors de la création de la carte : " . $e->getMessage());
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}

	function updateCarte(Request $request, Response $response, $args) {
		global $entityManager;
	
		try {
			// Récupération de l'ID de la carte depuis les paramètres de route
			$id = $args['id'];
	
			// Extraction des données du corps de la requête
			$data = $request->getParsedBody();

			error_log("Données reçues : " . json_encode($data));
	
			// Vérification de l'utilisateur dans les paramètres de requête
			$userId = $data['utilisateur_id'] ?? null;
			if (!$userId) {
				$response = $response->withStatus(400);
				$response->getBody()->write(json_encode(['error' => 'Utilisateur ID manquant']));
				return addHeaders($response);
			}

			error_log("ID utilisateur : " . $userId);
	
			// Récupération de la carte par son ID
			$carte = $entityManager->find('Entity\CartesCredit', $id);
			if (!$carte) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Carte non trouvée']));
				return addHeaders($response);
			}

			error_log("Carte trouvée : " . json_encode($carte));
	
			// Vérification que la carte appartient à l'utilisateur
			if ($carte->getUtilisateur()->getId() !== (int)$userId) {
				$response = $response->withStatus(403);
				$response->getBody()->write(json_encode(['error' => 'Accès non autorisé à cette carte']));
				return addHeaders($response);
			}
	
			// Mise à jour des informations de la carte
			$carte->setNumeroCarte($data['numero_carte'] ?? $carte->getNumeroCarte());
			$carte->setExpirationDate(new \DateTime($data['expiration_date'] ?? $carte->getExpirationDate()->format('Y-m-d')));
			$carte->setTitulaire($data['titulaire'] ?? $carte->getTitulaire());
			$carte->setCryptogramme($data['cryptogramme'] ?? $carte->getCryptogramme());

			error_log("Carte après mise à jour : " . json_encode($carte));
	
			// Persistance des changements
			$entityManager->flush();
	
			// Réponse de succès
			$response->getBody()->write(json_encode(['message' => 'Carte mise à jour avec succès']));
			return addHeaders($response);
	
		} catch (\Exception $e) {
			// Gestion des erreurs
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}
	

	function deleteCarte(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$id = $args['id'];

			$carte = $entityManager->find('Entity\CartesCredit', $id);
			if (!$carte) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Carte non trouvée']));
				return addHeaders($response);
			}

			$entityManager->remove($carte);
			$entityManager->flush();

			$response->getBody()->write(json_encode(['message' => 'Carte supprimée avec succès']));
			return addHeaders($response);
		} catch (\Exception $e) {
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}

	function getCartesByUtilisateur(Request $request, Response $response, $args) {
		global $entityManager;
		try {
			$queryParams = $request->getQueryParams();
			$utilisateurId = $queryParams['utilisateur_id'] ?? null;
	
			if (!$utilisateurId) {
				$response = $response->withStatus(400);
				$response->getBody()->write(json_encode(['error' => 'Utilisateur ID manquant']));
				return addHeaders($response);
			}
	
			// Vérification de l'existence de l'utilisateur
			$utilisateur = $entityManager->find('Entity\Utilisateurs', $utilisateurId);
			if (!$utilisateur) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['error' => 'Utilisateur non trouvé']));
				return addHeaders($response);
			}
	
			// Récupération des cartes de l'utilisateur
			$cartesRepository = $entityManager->getRepository('Entity\CartesCredit');
			$cartes = $cartesRepository->findBy(['utilisateur' => $utilisateur]);
	
			if (!$cartes) {
				$response = $response->withStatus(404);
				$response->getBody()->write(json_encode(['message' => 'Aucune carte trouvée pour cet utilisateur']));
				return addHeaders($response);
			}
	
			// Construction de la réponse
			$data = array_map(function($carte) {
				return [
					'id' => $carte->getId(),
					'utilisateur_id' => $carte->getUtilisateur()->getId(),
					'numero_carte' => $carte->getNumeroCarte(),
					'expiration_date' => $carte->getExpirationDate()->format('Y-m-d'),
					'titulaire' => $carte->getTitulaire(),
					'cryptogramme' => $carte->getCryptogramme(),
				];
			}, $cartes);

			$response->getBody()->write(json_encode($data));
			return addHeaders($response);
		} catch (\Exception $e) {
			error_log('Erreur: ' . $e->getMessage());
			$response = $response->withStatus(500);
			$response->getBody()->write(json_encode(['error' => $e->getMessage()]));
			return addHeaders($response);
		}
	}