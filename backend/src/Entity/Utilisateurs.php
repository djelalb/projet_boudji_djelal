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
    private $pass;

    // Getters
    public function getId() { return $this->id; }
    public function getNom() { return $this->nom; }
    public function getPrenom() { return $this->prenom; }
    public function getLogin() { return $this->login; }
    public function getPass() { return $this->pass; }

    // Setters
    public function setNom($nom) { $this->nom = $nom; }
    public function setPrenom($prenom) { $this->prenom = $prenom; }
    public function setLogin($login) { $this->login = $login; }
    public function setPass($pass) { $this->pass = $pass; }
}