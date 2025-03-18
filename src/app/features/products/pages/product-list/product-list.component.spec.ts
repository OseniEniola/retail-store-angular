import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../../../core';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { debounce } from 'lodash';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  beforeEach(() => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts']);
    TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      providers: [
        { provide: ProductService, useValue: productServiceMock }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call getproducts on initialization', () => {
    productServiceMock.getProducts.and.returnValue(of([]));

    component.ngOnInit();

    expect(productServiceMock.getProducts).toHaveBeenCalled();
  });

  it('should set loading to false and update product list on successful API response', () => {
    const products = [{ title: 'Product 1' }, { title: 'Product 2' }] as any;
    productServiceMock.getProducts.and.returnValue(of(products));

    component.ngOnInit();

    expect(component.productList).toEqual(products);
    expect(component.productListCopy).toEqual(products);
    expect(component.isLoading).toBeFalse();
  });


});
