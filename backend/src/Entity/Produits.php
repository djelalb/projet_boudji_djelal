<?php
namespace Entity;

/**
 * @Entity
 * @Table(name="produits")
 */
class Produits
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
    private $name;

    /**
     * @Column(type="decimal", precision=10, scale=2)
     */
    private $price;

    /**
     * @Column(type="string")
     */
    private $category;

    /**
     * @Column(type="string", nullable=true)
     */
    private $image;

    // Getters
    public function getId() { return $this->id; }
    public function getName() { return $this->name; }
    public function getPrice() { return $this->price; }
    public function getCategory() { return $this->category; }
    public function getImage() { return $this->image; }

    // Setters
    public function setName($name) { $this->name = $name; }
    public function setPrice($price) { $this->price = $price; }
    public function setCategory($category) { $this->category = $category; }
    public function setImage($image) { $this->image = $image; }
} 