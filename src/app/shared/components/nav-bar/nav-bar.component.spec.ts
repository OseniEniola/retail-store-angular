import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavBarComponent } from './nav-bar.component';
import { CartService } from '../../../core';
import { of } from 'rxjs';
import { CartItems } from '../../models';

// Create a mock of CartService
class MockCartService {
  getCartItems() {
    return of([
      { product: { id: 1, title: 'Product 1', price: 10, description: '', category: '', image: '', rating: { rate: 4, count: 100 } }, quantity: 2 },
      { product: { id: 2, title: 'Product 2', price: 20, description: '', category: '', image: '', rating: { rate: 5, count: 200 } }, quantity: 1 },
    ] as CartItems[]);
  }
}

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let cartService: MockCartService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarComponent ],
      providers: [{ provide: CartService, useClass: MockCartService }] // Use the mock service
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    cartService = TestBed.inject(CartService); // Inject the CartService

    fixture.detectChanges(); // Detect changes to trigger the ngOnInit lifecycle hook
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate the correct cartItemCount', () => {
    // Check the cartItemCount after the ngOnInit
    component.ngOnInit();
    expect(component.cartItemCount).toBe(3); // 2 from Product 1 and 1 from Product 2
  });

  it('should update cartItemCount when cart is updated', () => {
    // Initially, the count should be 3 (2 + 1)
    component.ngOnInit();
    expect(component.cartItemCount).toBe(3);

    // Simulate new data from the cart service
    cartService.getCartItems = () => of([
      { product: { id: 1, title: 'Product 1', price: 10, description: '', category: '', image: '', rating: { rate: 4, count: 100 } }, quantity: 5 },
      { product: { id: 2, title: 'Product 2', price: 20, description: '', category: '', image: '', rating: { rate: 5, count: 200 } }, quantity: 2 },
    ]);

    component.ngOnInit(); // Re-trigger ngOnInit
    fixture.detectChanges(); // Detect changes to update the view

    expect(component.cartItemCount).toBe(7); // 5 from Product 1 and 2 from Product 2
  });

  it('should close the cart when closeCart() is called', () => {
    component.isCartOpen = true; // Initially open
    component.closeCart(); // Close the cart
    expect(component.isCartOpen).toBeFalse(); // The cart should now be closed
  });
});
