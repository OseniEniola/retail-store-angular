import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CartItems, DiscountCode, discountCodes } from '../../models';
import { CartService } from '../../../core';
import { HotToastService } from '@ngxpert/hot-toast';

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
    this.cartService.getCartItems().subscribe((items: CartItems[]) => {
      this.cartItems = items;
      this.totalPrice = this.cartService.calculateCartTotal();
      this.applyDiscountCode()
    });
  }

  increaseQuantity(item: CartItems) {
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

  }

  closeCartWidget() {
    this.closeCart.emit(true);
  }

  clearCart() {
    this.cartService.clearCart();
    this.closeCartWidget();
    this.toastService.info("Cart cleared")

  }

  validateDiscountCode(code: string) {
    if(code.length < 1){
      this.toastService.info("Enter a valid code")
      return
    }
    let discount = discountCodes.find(
      (discountCode) => discountCode.code.toLowerCase() === code.toLowerCase()
    );
    if(discount){
      this.discountObj = discount
      this.applyDiscountCode();
      this.toastService.info("Discount applied")
    }else{
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
