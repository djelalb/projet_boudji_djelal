<?php
namespace Entity;

/**
 * @Entity
 * @Table(name="utilisateurs")
 */
class Utilisateurs
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @Column(type="string")
     */
    private $nom;

    /**
     * @Column(type="string")
     */
    private $prenom;

    /**
     * @Column(type="string")
     */
    private $login;

    /**
     * @Column(type="string")
     */
    private $password;

    /**
     * @Column(type="string")
     */
    private $email;

    /**
     * @Column(type="string")
     */
    private $adresse;

    /**
     * @Column(type="decimal")
     */
    private $telephone;

    // Getters
    public function getId() { return $this->id; }
    public function getNom() { return $this->nom; }
    public function getPrenom() { return $this->prenom; }
    public function getLogin() { return $this->login; }
    public function getPassword() { return $this->password; }
    public function getEmail() { return $this->email; }
    public function getAdresse() { return $this->adresse; }
    public function getTelephone() { return $this->telephone; }

    // Setters
    public function setNom($nom) { $this->nom = $nom; }
    public function setPrenom($prenom) { $this->prenom = $prenom; }
    public function setLogin($login) { $this->login = $login; }
    public function setPassword($password) { $this->password = $password; }
    public function setEmail($email) { $this->email = $email; }
    public function setAdresse($adresse) { $this->adresse = $adresse; }
    public function setTelephone($telephone) { $this->telephone = $telephone; }
}