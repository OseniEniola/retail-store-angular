import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core';
import { of, throwError } from 'rxjs';
import { Product } from '../../../../shared/models';
import { By } from '@angular/platform-browser';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  const mockProducts: Product[] = [
    { id: 1, title: 'Product A', price: 100, description: 'Description A', category: 'Category A', image: 'imageA.jpg', rating: { rate: 4, count: 100 } },
    { id: 2, title: 'Product B', price: 150, description: 'Description B', category: 'Category B', image: 'imageB.jpg', rating: { rate: 5, count: 200 } },
    { id: 3, title: 'Product C', price: 200, description: 'Description C', category: 'Category C', image: 'imageC.jpg', rating: { rate: 3, count: 50 } }
  ];

  beforeEach(() => {
    // Create a mock ProductService
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts']);
    productServiceMock.getProducts.and.returnValue(of(mockProducts));

    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ]
    });

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger change detection to initialize the component
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should retrieve the product list on init', () => {
    expect(component.productList).toEqual(mockProducts);
    expect(component.isLoading).toBeFalse();
  });

  it('should handle error when fetching products', () => {
    productServiceMock.getProducts.and.returnValue(throwError('Error fetching products'));
    component.getproducts();
    expect(component.isLoading).toBeFalse();
    expect(component.productList).toEqual([]);
  });

  it('should filter products based on search term', () => {
    const searchEvent = { target: { value: 'Product A' } };
    component.filterProducts(searchEvent);
    fixture.detectChanges(); // Trigger change detection after search
    expect(component.productList.length).toBe(1);
    expect(component.productList[0].title).toBe('Product A');
  });

  it('should reset the product list when search term is empty', () => {
    component.productList = mockProducts; // Reset to all products
    const searchEvent = { target: { value: '' } };
    component.filterProducts(searchEvent);
    fixture.detectChanges(); // Trigger change detection
    expect(component.productList.length).toBe(mockProducts.length);
  });

  it('should debounce the search functionality', (done) => {
    const searchEvent = { target: { value: 'Product' } };
    const spy = spyOn(component, 'filterProducts').and.callThrough();

    component.filterProducts(searchEvent);
    fixture.detectChanges();

    setTimeout(() => {
      expect(spy).toHaveBeenCalledTimes(1);
      done();
    }, 350); // Allow debounce time
  });
});
