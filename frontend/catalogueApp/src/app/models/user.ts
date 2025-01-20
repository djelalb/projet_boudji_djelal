import { Product } from './product';

export class User {
    id: number;
    name: string;
    firstname: string;
    pass: string;
    cart: Product[];

    constructor(id: number, name: string, firstname: string, pass: string) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.pass = pass;
        this.cart = [];
    }
}