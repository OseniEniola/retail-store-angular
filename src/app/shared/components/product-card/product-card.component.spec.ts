import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card.component';
import { CartService } from '../../../core';
import { HotToastService } from '@ngxpert/hot-toast';
import { ChangeDetectorRef, PLATFORM_ID } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let cartServiceMock: jasmine.SpyObj<CartService>;
  let toastServiceMock: jasmine.SpyObj<HotToastService>;
  let cdrMock: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(() => {
    cartServiceMock = jasmine.createSpyObj('CartService', ['addToCart']);
    toastServiceMock = jasmine.createSpyObj('HotToastService', ['success']);
    cdrMock = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: HotToastService, useValue: toastServiceMock },
        { provide: ChangeDetectorRef, useValue: cdrMock },
        { provide: PLATFORM_ID, useValue: 'browser' }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  



  it('should call addToCart method and show success message when adding item to cart', () => {
    const product = { id: 1, name: 'Product 1', rating: { rate: 4 }, price: 100 } as any;
    component.product = product;

    cartServiceMock.addToCart.and.returnValue(1);
    component.addToCart();

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({ product, quantity: 1 });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Item added to cart');
  });

  it('should show "Item is already in cart" message when item already exists in cart', () => {
    const product = { id: 1, name: 'Product 1', rating: { rate: 4 }, price: 100 } as any;
    component.product = product;

    cartServiceMock.addToCart.and.returnValue(0);
    component.addToCart();

    expect(cartServiceMock.addToCart).toHaveBeenCalledWith({ product, quantity: 1 });
    expect(toastServiceMock.success).toHaveBeenCalledWith('Item is already in cart');
  });

});
