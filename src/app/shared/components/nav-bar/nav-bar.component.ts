import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../../core';
import { CartItems } from '../../models';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  cartItemCount: number = 0;
  isCartOpen: boolean = false;

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items: CartItems[]) => {
      this.cartItemCount = items.length;
    });
  }

  closeCart() {
    this.isCartOpen = false;
  }
}
