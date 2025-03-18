import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartItems, DiscountCode, discountCodes } from '../../models';
import { CartService } from '../../../core';
import { HotToastService } from '@ngxpert/hot-toast';
import { combineLatest } from 'rxjs';
import * as _ from 'lodash';

@Component({
  selector: 'app-cart-widget',
  templateUrl: './cart-widget.component.html',
  styleUrl: './cart-widget.component.scss',
})
export class CartWidgetComponent {
  @Input() isCartOpen: boolean = false;
  @Output() closeCart = new EventEmitter<boolean>();


  private toastService = inject(HotToastService);


  cartItems: CartItems[] = [];
  totalPrice: number = 0;
  discountAmount: number = 0;
  discountCode: string = "";
  discountObj: DiscountCode = {} as DiscountCode;

  constructor(public cartService: CartService) {
    combineLatest([
      this.cartService.getCartItems(),
      this.cartService.getAppliedDiscountCode()
    ]).subscribe(([cartItems, discountCode]) => {
      this.cartItems = cartItems;
      this.discountCode = discountCode;
      this.totalPrice = this.cartService.calculateCartTotal();
  
      this.discountCode && this.validateDiscountCode(this.discountCode,true);
    });
  }

  increaseQuantity(item: CartItems) {
    if(item.quantity >= 5){
      this.toastService.info("You cant add more than 5 item of same type")
    return
    }
    let quantity = Math.min(5, item.quantity + 1);
    this.cartService.updateQuantity(item, quantity);
  }

  decreaseQuantity(item: CartItems) {
    let quantity = Math.max(0, item.quantity - 1);
    this.cartService.updateQuantity(item, quantity);
  }

  removeItemFromCart(item: CartItems) {
    this.cartService.removeFromCart(item);
    this.toastService.info("Item removed")
    if(this.cartItems.length < 1 && discountCodes){
      this.cartService.clearDiscount()
      this.closeCartWidget()
    }
  }

  closeCartWidget() {
    this.closeCart.emit(true);
  }

  clearCart() {
    this.cartService.clearCart();
    this.closeCartWidget();
    this.toastService.info("Cart cleared")

  }

  clearDiscount(){
    if(this.discountCode){
      this.cartService.clearDiscount()
      this.discountCode = "";
      this.discountObj = {} as DiscountCode
      this.discountAmount = 0
      this.toastService.info("Dicount removed")
    }
  }

  validateDiscountCode(code: string,isInit?:boolean) {
    if(this.cartItems.length < 1){
      this.toastService.info("Cart is empty, Please add item to apply discount")
      return
    }
    if(code.length < 1){
      this.toastService.info("Enter a valid code")
      return
    }
    if(!_.isEmpty(this.discountObj)){
      this.toastService.info("Discount already applied")
      return
    }

    let discount = discountCodes.find(
      (discountCode) => discountCode.code.toLowerCase() === code.toLowerCase()
    );
    if(discount){
      this.discountObj = discount
      this.applyDiscountCode();
      this.cartService.applyDiscount(this.discountCode)
      !isInit && this.toastService.info("Discount applied")
    }else{
      this.cartService.clearDiscount()
      this.toastService.success("Discount code not valid")
    }
  }
  applyDiscountCode() {
    if ( this.discountObj) {
      if ( this.discountObj.dicountType === 'percentage') {
        this.discountAmount = this.totalPrice * ( this.discountObj.discountAmount / 100);
      } else {
        this.discountAmount =  this.discountObj.discountAmount;
      }
    }
  }
}
