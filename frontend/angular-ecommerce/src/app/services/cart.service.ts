import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { Subject, find } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem : CartItem) {
    let alreadyExistingInCart: boolean = false;
    let existingCartItem: CartItem = null;

    if(this.cartItems.length > 0) {
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
    }
    alreadyExistingInCart = (existingCartItem != null);
    if(alreadyExistingInCart) {
      existingCartItem.quantity++;
    }else {
      this.cartItems.push(theCartItem);
    }

    this.computeCartTotals();
  }


  computeCartTotals() {
    let totalPriceValue: number =0;
    let totalQuantityValue: number =0;

    for(let currentCartItem of this.cartItems ) {
      totalPriceValue+= currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
  }
}
