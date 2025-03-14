import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { Product } from '../../shared/models';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1,
      title: 'Test Product 1',
      price: 100,
      description: 'Test Description 1',
      category: 'Category 1',
      image: 'image-url-1',
      rating: { rate: 4.5, count: 10 }
    },
    {
      id: 2,
      title: 'Test Product 2',
      price: 200,
      description: 'Test Description 2',
      category: 'Category 2',
      image: 'image-url-2',
      rating: { rate: 4.0, count: 20 }
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all products', () => {
    service.getProducts().subscribe(products => {
      expect(products.length).toBe(2);
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should fetch product by ID', () => {
    const productId = 1;
    service.getProductsById(productId).subscribe(product => {
      expect(product).toEqual(mockProducts[0]);
      expect(product.id).toBe(productId);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts[0]);
  });

});
