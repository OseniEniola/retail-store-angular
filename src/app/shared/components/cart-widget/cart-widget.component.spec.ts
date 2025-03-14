import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartWidgetComponent } from './cart-widget.component';
import { CartService } from '../../../core';
import { of } from 'rxjs';
import { CartItems, DiscountCode } from '../../models';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;

  const mockCartItems: CartItems[] = [
    {
      product: { id: 1, title: 'Test Product 1', price: 100, description: 'Test', category: 'Category', image: '', rating: { rate: 4, count: 10 } },
      quantity: 2
    },
    {
      product: { id: 2, title: 'Test Product 2', price: 200, description: 'Test', category: 'Category', image: '', rating: { rate: 4, count: 20 } },
      quantity: 1
    }
  ];

  const mockDiscountCodes: DiscountCode[] = [
    { code: 'DISCOUNT10', discountAmount: 10, dicountType: 'percentage' },
    { code: 'FLAT50', discountAmount: 50, dicountType: 'flat' }
  ];

  beforeEach(() => {
    // Create a mock CartService using Jasmine's createSpyObj
    cartServiceMock = jasmine.createSpyObj('CartService', ['getCartItems', 'calculateCartTotal', 'updateQuantity', 'removeFromCart', 'clearCart']);

    // Mocking the return values for the service methods
    cartServiceMock.getCartItems.and.returnValue(of(mockCartItems));
    cartServiceMock.calculateCartTotal.and.returnValue(400); // Sample total

    TestBed.configureTestingModule({
      declarations: [CartWidgetComponent],
      imports: [FormsModule], 
      providers: [
        { provide: CartService, useValue: cartServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA] 
    });

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers the initial change detection cycle
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch cart items from the cart service', () => {
    component.cartService.getCartItems().subscribe((items) => {
      expect(items).toEqual(mockCartItems);
    });
  });

  it('should calculate the total price correctly', () => {
    expect(component.totalPrice).toBe(400);
  });

  it('should increase the quantity of the item', () => {
    const item = mockCartItems[0];
    component.increaseQuantity(item);
    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(item, 3);
  });

  it('should decrease the quantity of the item', () => {
    const item = mockCartItems[0];
    component.decreaseQuantity(item);
    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(item, 1);
  });

  it('should remove an item from the cart', () => {
    const item = mockCartItems[0];
    component.removeItemFromCart(item);
    expect(cartServiceMock.removeFromCart).toHaveBeenCalledWith(item);
  });

  it('should clear the cart', () => {
    component.clearCart();
    expect(cartServiceMock.clearCart).toHaveBeenCalled();
  });

  it('should validate discount code and apply percentage discount', () => {
    const discountCode = 'DISCOUNT10';
    component.validateDiscountCode(discountCode);
    expect(component.discountObj.code).toBe('DISCOUNT10');
    expect(component.discountAmount).toBe(40); // 10% of total price (400)
  });

  it('should validate discount code and apply flat discount', () => {
    const discountCode = 'FLAT50';
    component.validateDiscountCode(discountCode);
    expect(component.discountObj.code).toBe('FLAT50');
    expect(component.discountAmount).toBe(50); // Flat discount of 50
  });
});
