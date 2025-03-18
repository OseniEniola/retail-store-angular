import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartWidgetComponent } from './cart-widget.component';
import { CartService } from '../../../core';
import { HotToastService } from '@ngxpert/hot-toast';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DiscountCode } from '../../models';

describe('CartWidgetComponent', () => {
  let component: CartWidgetComponent;
  let fixture: ComponentFixture<CartWidgetComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let toastServiceMock: jasmine.SpyObj<HotToastService>;

  beforeEach(() => {
    cartServiceMock = jasmine.createSpyObj('CartService', [
      'getCartItems',
      'getAppliedDiscountCode',
      'calculateCartTotal',
      'updateQuantity',
      'removeFromCart',
      'clearDiscount',
      'clearCart',
      'applyDiscount'
    ]);
    toastServiceMock = jasmine.createSpyObj('HotToastService', ['info', 'success']);

    TestBed.configureTestingModule({
      declarations: [CartWidgetComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: HotToastService, useValue: toastServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CartWidgetComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should increase quantity of an item within limit', () => {
    const item = { id: 1, quantity: 3, price: 20 } as  any;

    cartServiceMock.updateQuantity.and.callFake(() => {});
    fixture.detectChanges();

    component.increaseQuantity(item);
    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(item, 4);
  });

  it('should not increase quantity if the item is at maximum (5)', () => {
    const item = { id: 1, quantity: 5, price: 20 }as  any;

    cartServiceMock.updateQuantity.and.callFake(() => {});
    fixture.detectChanges();

    component.increaseQuantity(item);
    expect(toastServiceMock.info).toHaveBeenCalledWith('You cant add more than 5 item of same type');
    expect(cartServiceMock.updateQuantity).not.toHaveBeenCalled();
  });

  it('should decrease quantity of an item', () => {
    const item = { id: 1, quantity: 3, price: 20 } as  any;

    cartServiceMock.updateQuantity.and.callFake(() => {});
    fixture.detectChanges();

    component.decreaseQuantity(item);
    expect(cartServiceMock.updateQuantity).toHaveBeenCalledWith(item, 2);
  });

  
  it('should clear the cart and close the cart widget', () => {
    cartServiceMock.clearCart.and.callFake(() => {});
    component.closeCartWidget = jasmine.createSpy();

    component.clearCart();

    expect(cartServiceMock.clearCart).toHaveBeenCalled();
    expect(component.closeCartWidget).toHaveBeenCalled();
    expect(toastServiceMock.info).toHaveBeenCalledWith('Cart cleared');
  });

  it('should clear the discount and reset discount values', () => {
    component.discountCode = 'DISCOUNT10';
    component.discountObj = { code: 'DISCOUNT10', discountAmount: 10, dicountType: 'flat' } as DiscountCode;
    component.discountAmount = 10;

    cartServiceMock.clearDiscount.and.callFake(() => {});

    component.clearDiscount();

    expect(cartServiceMock.clearDiscount).toHaveBeenCalled();
    expect(component.discountCode).toBe('');
    expect(component.discountObj).toEqual({} as any);
    expect(component.discountAmount).toBe(0);
    expect(toastServiceMock.info).toHaveBeenCalledWith('Dicount removed');
  });

  

  it('should show error if discount code is invalid', () => {
    const invalidCode = 'INVALIDCODE';
    component.cartItems = [{ id: 1, quantity: 1, price: 20 }] as any;
    cartServiceMock.clearDiscount.and.callFake(() => {});

    component.validateDiscountCode(invalidCode);

    expect(cartServiceMock.clearDiscount).toHaveBeenCalled();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Discount code not valid');
  });

  it('should show error if no items in cart when applying discount', () => {
    component.cartItems = [];
    component.validateDiscountCode('SAVE10');

    expect(toastServiceMock.info).toHaveBeenCalledWith('Cart is empty, Please add item to apply discount');
  });
});
