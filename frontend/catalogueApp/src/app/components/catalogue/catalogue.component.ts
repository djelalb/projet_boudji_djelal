import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product';
import { SearchComponent } from '../search/search.component';
import { Observable, of } from 'rxjs';
import { map, startWith, take, catchError } from 'rxjs/operators';
import { Store } from '@ngxs/store';
import { AddToCart } from '../../state/cart.state';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css'],
  standalone: true,
  imports: [CommonModule, SearchComponent],
})
export class CatalogueComponent implements OnInit {
  products$!: Observable<Product[]>;
  filteredProducts$!: Observable<Product[]>;
  paginatedProducts: Product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  maxPageNumber: number = 1;
  isLoading: boolean = true;
  quantities: Map<number, number> = new Map();

  constructor(private apiService: ApiService, private store: Store) {}

  ngOnInit(): void {
    this.isLoading = true;
    // Utilisation de l'ApiService pour récupérer le catalogue
    this.products$ = this.apiService.getCatalogue().pipe(
      take(1),
      catchError((error) => {
        this.isLoading = false;
        console.error('Erreur lors du chargement du catalogue', error);
        return of([]); // retourne un tableau vide en cas d'erreur
      })
    );

    this.filteredProducts$ = this.products$.pipe(
      map((products) => {
        this.isLoading = false;
        this.maxPageNumber = Math.ceil(products.length / this.itemsPerPage);
        return products;
      })
    );

    this.filteredProducts$.subscribe((products) => this.updatePagination(products));
  }

  filterProducts(filters: {
    term: string;
    category: string;
    minPrice: number | null;
    maxPrice: number | null;
  }) {
    this.filteredProducts$ = this.products$.pipe(
      map((products) =>
        products.filter((product) => {
          const matchesName = product.name.toLowerCase().includes(filters.term.toLowerCase());
          const matchesCategory = product.category.toLowerCase().includes(filters.category.toLowerCase());
          const matchesMinPrice = filters.minPrice !== null ? product.price >= filters.minPrice : true;
          const matchesMaxPrice = filters.maxPrice !== null ? product.price <= filters.maxPrice : true;
          return matchesName && matchesCategory && matchesMinPrice && matchesMaxPrice;
        })
      ),
      startWith([])
    );

    this.filteredProducts$.subscribe((products) => {
      this.maxPageNumber = Math.ceil(products.length / this.itemsPerPage);
      this.updatePagination(products);
    });
  }

  updatePagination(products: Product[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedProducts = products.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    if (page < 1 || page > this.maxPageNumber) return;
    this.currentPage = page;
    this.filteredProducts$.pipe(take(1)).subscribe((products) => this.updatePagination(products));
  }

  getQuantity(product: Product): number {
    return this.quantities.get(product.id) || 1;
  }

  incrementQuantity(product: Product) {
    const currentQty = this.getQuantity(product);
    this.quantities.set(product.id, currentQty + 1);
  }

  decrementQuantity(product: Product) {
    const currentQty = this.getQuantity(product);
    if (currentQty > 1) {
      this.quantities.set(product.id, currentQty - 1);
    }
  }

  addToCart(product: Product) {
    const quantity = this.getQuantity(product);
    this.store.dispatch(new AddToCart(product, quantity));
    this.quantities.set(product.id, 1);
  }
}
