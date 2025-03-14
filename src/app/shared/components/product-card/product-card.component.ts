import { AfterViewInit, Component, Input } from '@angular/core';
import { Product } from '../../models';
import { CartService } from '../../../core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent  implements AfterViewInit{

  @Input() product: Product = {} as Product;

  constructor(private cartService: CartService) {
  }

  fallbackImage = 'https://placehold.co/600x400?text=Not+Available';
  isUsingFallback = false;
  backgroundImage = this.product.image; 


  ngAfterViewInit() {
    this.checkImage(this.product.image);
  }

  get fullStars() {
    return Math.floor(this.product.rating.rate);
  }

  addToCart() {
    this.cartService.addToCart({ product: this.product, quantity: 1 });
  }

  checkImage(imgUrl: string) {
    const img = new Image();
    img.src = imgUrl;
    img.onload = () => {
      this.backgroundImage = imgUrl; 
    };
    img.onerror = () => {
      this.backgroundImage = this.fallbackImage; 
      this.isUsingFallback = true;
    };
  }
}
