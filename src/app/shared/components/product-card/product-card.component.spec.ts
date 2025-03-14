import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../../core';
import { of } from 'rxjs';
import { Product } from '../../models';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'A great product',
    category: 'Category',
    image: 'https://test.com/image.jpg',
    rating: { rate: 4, count: 100 }
  };

  beforeEach(() => {
    // Create a mock CartService
    cartServiceMock = jasmine.createSpyObj('CartService', ['addToCart']);
    
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock }
      ]
    });

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = mockProduct; // Set the input product
    fixture.detectChanges(); // Trigger change detection
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the product image', () => {
    expect(component.backgroundImage).toBe(mockProduct.image);
  });

  it('should call addToCart method when addToCart is invoked', () => {
    component.addToCart();
    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({ product: mockProduct, quantity: 1 });
  });

  it('should handle image error and fallback to placeholder image', () => {
    // Simulate an image error
    const imgUrl = 'https://invalid-url.com/image.jpg';
    component.checkImage(imgUrl);
    expect(component.backgroundImage).toBe(component.fallbackImage);
    expect(component.isUsingFallback).toBe(true);
  });

  it('should handle image loading correctly', () => {
    // Simulate a successful image load
    const imgUrl = 'https://valid-url.com/image.jpg';
    component.checkImage(imgUrl);
    expect(component.backgroundImage).toBe(imgUrl);
    expect(component.isUsingFallback).toBe(false);
  });

  it('should calculate fullStars correctly', () => {
    const fullStars = component.fullStars;
    expect(fullStars).toBe(4); // Because the rating is 4
  });

  it('should not change the background image if the image is valid', () => {
    component.checkImage(mockProduct.image);
    expect(component.backgroundImage).toBe(mockProduct.image);
    expect(component.isUsingFallback).toBe(false);
  });
});
