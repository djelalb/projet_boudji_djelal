export class Product {
    id: number;
    name: string;
    price: number;
    category: string;
    image: string;

    constructor(id: number, name: string, price: number, category: string, image: string) {
      this.id = id;
      this.name = name;
      this.price = price;
      this.category = category;
      this.image = image;
  }
  }