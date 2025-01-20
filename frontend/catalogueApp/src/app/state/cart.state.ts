import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Product } from '../models/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export class AddToCart {
  static readonly type = '[Cart] Add';
  constructor(public product: Product, public quantity: number) {}
}

export class RemoveFromCart {
  static readonly type = '[Cart] Remove';
  constructor(public productId: number) {}
}

export class UpdateQuantity {
  static readonly type = '[Cart] Update Quantity';
  constructor(public productId: number, public quantity: number) {}
}

export interface CartStateModel {
  items: CartItem[];
}

@State<CartStateModel>({
  name: 'cart',
  defaults: {
    items: []
  }
})
@Injectable()
export class CartState {
  @Selector()
  static getCartItems(state: CartStateModel): CartItem[] {
    return state?.items?.filter(item => item && item.product) || [];
  }
  
  @Selector()
  static getCartCount(state: CartStateModel): number {
    if (!state?.items) return 0;
    
    return state.items
      .filter(item => item && (item.quantity || item.product))
      .reduce((total, item) => {
        if (item.quantity && item.product) {
          return total + item.quantity;
        }
        return total + 1;
      }, 0);
  }

  @Action(AddToCart)
  addToCart(ctx: StateContext<CartStateModel>, action: AddToCart) {
    if (!action.product) return;

    const state = ctx.getState();
    const items = state.items || [];
    
    const existingItemIndex = items.findIndex(item => 
      item.product?.id === action.product.id
    );

    if (existingItemIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + action.quantity
      };
      ctx.setState({
        ...state,
        items: updatedItems
      });
    } else {
      ctx.setState({
        ...state,
        items: [...items, { 
          product: action.product, 
          quantity: action.quantity 
        }]
      });
    }
  }

  @Action(RemoveFromCart)
  removeFromCart(ctx: StateContext<CartStateModel>, action: RemoveFromCart) {
    const state = ctx.getState();
    ctx.setState({
      ...state,
      items: (state.items || []).filter(item => item.product?.id !== action.productId)
    });
  }

  @Action(UpdateQuantity)
  updateQuantity(ctx: StateContext<CartStateModel>, action: UpdateQuantity) {
    const state = ctx.getState();
    if (action.quantity <= 0) {
      ctx.setState({
        ...state,
        items: (state.items || []).filter(item => item.product?.id !== action.productId)
      });
    } else {
      const items = (state.items || []).map(item => 
        item.product?.id === action.productId 
          ? { ...item, quantity: action.quantity }
          : item
      );
      ctx.setState({
        ...state,
        items
      });
    }
  }
}