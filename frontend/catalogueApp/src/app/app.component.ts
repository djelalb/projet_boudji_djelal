import { Component, Renderer2 } from '@angular/core';
import { CatalogueComponent } from './components/catalogue/catalogue.component';
import { SearchComponent } from './components/search/search.component';
import { Store, Select } from '@ngxs/store';
import { CartState } from './state/cart.state';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CatalogueComponent, SearchComponent, CommonModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cartCount$: Observable<number>;

  constructor(private router: Router, private renderer: Renderer2, private store: Store) {
    this.cartCount$ = this.store.select(CartState.getCartCount);

    this.router.events.subscribe(() => {
      if (this.router.url === '/cart') {
        this.renderer.addClass(document.body, 'cart-active');
      } else {
        this.renderer.removeClass(document.body, 'cart-active');
      }
    });
  }

  isSpecialRoute(): boolean {
    const specialRoutes = ['/cart', '/account', '/login', '/signup'];
    return specialRoutes.includes(this.router.url);
  }

}
