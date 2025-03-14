import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../core';
import { Product } from '../../../../shared/models';

import _, { debounce } from 'lodash';


@Component({
  selector: 'app-product-list',
  standalone: false,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  isLoading:boolean = true
  isSearching:boolean = false

  productList: Product[] = []
  productListCopy: Product[] = []
  searchTerm: string = ''
  constructor(private productService: ProductService) {
    this.filterProducts = debounce(this.filterProducts.bind(this), 300);
   }

  ngOnInit(): void {
    this.getproducts();
  }


  getproducts() {
    this.isLoading = true;
     this.productService.getProducts().subscribe({
      next: (products) => {
        this.productList = products;
        this.productListCopy = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
     }});
  }

  filterProducts(event: any) {
    let searchTerm = event?.target?.value;
    if(!searchTerm) {
      this.productList = this.productListCopy;
      return;
    }
    this.isSearching = true;
    this.productList= []
    this.productList = this.productListCopy.filter((product) => {
      return product.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
    );
   setInterval(() => {
      this.isSearching = false;
    }
    , 2000);
  }
}
