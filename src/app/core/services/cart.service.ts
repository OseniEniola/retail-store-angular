import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItems } from '../../shared/models';
import { StorageService } from './storage.service';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItems[]>([]);
  private discountCode = new BehaviorSubject<string>("");

  cartItems$ = this.cartItems.asObservable();
  discountCode$ = this.discountCode.asObservable();
  constructor(private storageService: StorageService, private toastService:HotToastService) {
    const storedCart = this.storageService.getItem<CartItems[]>('cart') || [];
    const storedDiscountCode = this.storageService.getItem<string>('discount') || "";
    this.cartItems.next(storedCart);
    this.discountCode.next(storedDiscountCode);
  }

  addToCart(product: CartItems): number {
    let items = this.cartItems.getValue();
    let index = items.findIndex(item => item.product.id === product.product.id);
    
    if (index > -1) {
      return -1;
     // items[index].quantity += product.quantity;
    } else {
      items.push(product);
    }

    this.cartItems.next(items);
    this.storageService.setItem('cart', items);
    return 1;
  }

  removeFromCart(product: CartItems) {
    let items = this.cartItems.getValue();
    let updatedItems = items.filter(item => item.product.id !== product.product.id);

    this.cartItems.next(updatedItems);
    this.storageService.setItem('cart', updatedItems);
  }

  getCartItems() {
    return this.cartItems.asObservable();
  }

  getAppliedDiscountCode() {
    return this.discountCode.asObservable();
  }

  clearCart() {
    this.cartItems.next([]);
    this.storageService.removeItem('cart');
  }

  calculateCartTotal(): number {
    return this.cartItems.getValue().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  updateQuantity(product: CartItems, quantity: number) {
    let items = this.cartItems.getValue();
    let index = items.findIndex(item => item.product.id === product.product.id);
    if (index > -1) {
      items[index].quantity = quantity;
    }
    if (items[index].quantity === 0) {
      items = items.filter(item => item.product.id !== product.product.id);
    }
    this.storageService.setItem('cart', items);
    this.cartItems.next(items);
  }

  applyDiscount(code:string){
    this.storageService.setItem('discount',code)
  }

  clearDiscount(){
    this.storageService.removeItem('discount')
  }
}
