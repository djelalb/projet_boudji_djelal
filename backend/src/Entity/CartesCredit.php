<?php
namespace Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * @Entity
 * @Table(name="CartesCredit")
 */
class CartesCredit
{
    /**
     * @Id
     * @Column(type="integer")
     * @GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @Column(type="integer")
     */
    private $utilisateur_id;

    /**
     * @Column(type="string", length=16)
     */
    private $numero_carte;

    /**
     * @Column(type="date")
     */
    private $expiration_date;

    /**
     * @Column(type="string", length=255)
     */
    private $titulaire;

    /**
     * @Column(type="string", length=3)
     */
    private $cryptogramme;

    /**
     * @ManyToOne(targetEntity="Entity\Utilisateurs", inversedBy="cartes")
     * @JoinColumn(name="utilisateur_id", referencedColumnName="id", onDelete="CASCADE")
     */
    private $utilisateur;

    // Getters et Setters

    public function getId() { return $this->id; }
    public function getUtilisateurId() { return $this->utilisateur_id; }
    public function getNumeroCarte() { return $this->numero_carte; }
    public function getExpirationDate() { return $this->expiration_date; }
    public function getTitulaire() { return $this->titulaire; }
    public function getCryptogramme() { return $this->cryptogramme; }

    public function setUtilisateurId($utilisateur_id) { $this->utilisateur_id = $utilisateur_id; }
    public function setNumeroCarte($numero_carte) { $this->numero_carte = $numero_carte; }
    public function setExpirationDate($expiration_date) { $this->expiration_date = $expiration_date; }
    public function setTitulaire($titulaire) { $this->titulaire = $titulaire; }
    public function setCryptogramme($cryptogramme) { $this->cryptogramme = $cryptogramme; }

    public function getUtilisateur() { return $this->utilisateur; }
    public function setUtilisateur($utilisateur) { $this->utilisateur = $utilisateur; }
}
