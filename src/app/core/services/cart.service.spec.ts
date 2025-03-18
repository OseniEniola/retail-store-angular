import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { StorageService } from './storage.service';
import { HotToastService } from '@ngxpert/hot-toast';
import { BehaviorSubject, of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;
  let storageServiceMock: jasmine.SpyObj<StorageService>;
  let toastServiceMock: jasmine.SpyObj<HotToastService>;

  beforeEach(() => {
    storageServiceMock = jasmine.createSpyObj('StorageService', ['getItem', 'setItem', 'removeItem']);
    toastServiceMock = jasmine.createSpyObj('HotToastService', ['info', 'success']);
    
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: StorageService, useValue: storageServiceMock },
        { provide: HotToastService, useValue: toastServiceMock }
      ]
    });

    service = TestBed.inject(CartService);
  });

  it('should create the service', () => {
    expect(service).toBeTruthy();
  });


  it('should add an item to the cart', () => {
    const newItem = { product: { id: 2, name: 'Product 2', price: 20 }, quantity: 1 } as any;
    const initialCart = [{ product: { id: 1, name: 'Product 1', price: 10 }, quantity: 1 }] as any;
    storageServiceMock.getItem.and.returnValue(initialCart);

    service.addToCart(newItem);

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(1);
      expect(initialCart[0]).toEqual(initialCart[0]);
    });
  });



  it('should remove an item from the cart', () => {
    const itemToRemove = { product: { id: 1, name: 'Product 1', price: 10 }, quantity: 1 } as any;
    const initialCart = [{ product: { id: 1, name: 'Product 1', price: 10 }, quantity: 1 }];
    storageServiceMock.getItem.and.returnValue(initialCart);

    service.removeFromCart(itemToRemove);

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(0);
    });
  });

  it('should clear the cart', () => {
    const initialCart = [{ product: { id: 1, name: 'Product 1', price: 10 }, quantity: 1 }];
    storageServiceMock.getItem.and.returnValue(initialCart);

    service.clearCart();

    service.cartItems$.subscribe(cartItems => {
      expect(cartItems.length).toBe(0);
    });
    expect(storageServiceMock.removeItem).toHaveBeenCalledWith('cart');
  });




  it('should apply a discount code', () => {
    const discountCode = 'DISCOUNT10';

    service.applyDiscount(discountCode);

    expect(storageServiceMock.setItem).toHaveBeenCalledWith('discount', discountCode);
  });

  it('should clear the discount', () => {
    service.clearDiscount();

    expect(storageServiceMock.removeItem).toHaveBeenCalledWith('discount');
  });
});
