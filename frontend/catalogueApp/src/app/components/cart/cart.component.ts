// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { CartState, RemoveFromCart, UpdateQuantity, CartItem } from '../../state/cart.state';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  @Select(CartState.getCartItems) cartItems$!: Observable<CartItem[]>;
  total$: Observable<number> = of(0);

  constructor(private store: Store) {
    this.cartItems$ = this.store.select(CartState.getCartItems);
  }

  ngOnInit(): void {
    this.total$ = this.cartItems$.pipe(
      map((items) => {
        if (!items) return 0;
        return items.reduce((total, item) => {
          if (!item || !item.product) return total;
          const price = item.product.price || 0;
          const quantity = item.quantity || 1;
          return total + (price * quantity);
        }, 0);
      })
    );
  }

  updateQuantity(productId: number, newQuantity: number): void {
    if (!productId) return;
    
    if (newQuantity <= 0) {
      this.removeFromCart(productId);
    } else {
      this.store.dispatch(new UpdateQuantity(productId, newQuantity));
    }
  }

  removeFromCart(productId: number): void {
    if (!productId) return;
    this.store.dispatch(new RemoveFromCart(productId));
  }

  isValidCartItem(item: CartItem | null | undefined): boolean {
    return !!item && !!item.product && !!item.product.id;
  }
}