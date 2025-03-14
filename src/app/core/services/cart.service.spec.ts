import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StorageService } from './storage.service';
import { CartItems, Product } from '../../shared/models';

describe('CartService', () => {
  let cartService: CartService;
  let storageService: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const storageSpy = jasmine.createSpyObj('StorageService', ['getItem', 'setItem', 'removeItem']);

    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    cartService = TestBed.inject(CartService);
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 100,
    description: 'Test Description',
    category: 'Test Category',
    image: 'test.jpg',
    rating: { rate: 4.5, count: 10 }
  };

  const mockCartItem: CartItems = {
    product: mockProduct,
    quantity: 1
  };

  it('should initialize with stored cart data', () => {
    storageService.getItem.and.returnValue([mockCartItem]);
    const service = new CartService(storageService);
    service.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].product.id).toBe(mockProduct.id);
    });
  });

  it('should add item to cart', () => {
    cartService.addToCart(mockCartItem);
    cartService.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(1);
    });
  });

  it('should increase quantity if item already exists in cart', () => {
    cartService.addToCart(mockCartItem);
    cartService.addToCart(mockCartItem);
    cartService.getCartItems().subscribe(items => {
      expect(items.length).toBe(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  it('should remove item from cart', () => {
    cartService.addToCart(mockCartItem);
    cartService.removeFromCart(mockCartItem);
    cartService.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should update item quantity', () => {
    cartService.addToCart(mockCartItem);
    cartService.updateQuantity(mockCartItem, 3);
    cartService.getCartItems().subscribe(items => {
      expect(items[0].quantity).toBe(3);
    });
  });

  it('should remove item if quantity is set to 0', () => {
    cartService.addToCart(mockCartItem);
    cartService.updateQuantity(mockCartItem, 0);
    cartService.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should clear the cart', () => {
    cartService.addToCart(mockCartItem);
    cartService.clearCart();
    cartService.getCartItems().subscribe(items => {
      expect(items.length).toBe(0);
    });
  });

  it('should calculate the correct total price', () => {
    cartService.addToCart(mockCartItem);
    cartService.updateQuantity(mockCartItem, 2);
    expect(cartService.calculateCartTotal()).toBe(200);
  });

});
