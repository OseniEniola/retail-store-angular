import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  PLATFORM_ID,
} from '@angular/core';
import { Product } from '../../models';
import { CartService } from '../../../core';
import { HotToastService } from '@ngxpert/hot-toast';
import { isPlatformBrowser } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProductCardComponent implements AfterViewInit {
  @Input() product: Product = {} as Product;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private cartService: CartService,
    private toastService: HotToastService,
    private cdr: ChangeDetectorRef
  ) {}

  fallbackImage = 'https://placehold.co/600x400?text=Image+Not+Available';
  isUsingFallback = false;
  backgroundImage = this.product.image;

  ngAfterViewInit() {
    this.checkImage(this.product.image);
  }

  get fullStars() {
    return Math.floor(this.product.rating.rate);
  }

  addToCart() {
    const response =this.cartService.addToCart({ product: this.product, quantity: 1 });
    response == 1 ? this.toastService.success('Item added to cart') : this.toastService.success('Item is already in cart');
  }

  checkImage(imgUrl: string) {
    if (isPlatformBrowser(this.platformId)) {
      const img = new Image();
      img.src = imgUrl;
      img.onload = () => {
        this.backgroundImage = imgUrl;
        this.cdr.detectChanges();
      };
      img.onerror = () => {
        this.backgroundImage = this.fallbackImage;
        this.isUsingFallback = true;
        this.cdr.detectChanges();
      };
    } else {
      this.backgroundImage = this.fallbackImage;
      this.isUsingFallback = true;
      this.cdr.detectChanges();
    }
  }
}
