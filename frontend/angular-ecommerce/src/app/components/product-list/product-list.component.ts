import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products : Product[] = [];
  searchMode : boolean = false;

  previousCategoryId: number = 1;
  currentCategoryId : number = 1;
  previousKeyword : string = '';

  // Pagination properties
  thePageNumber : number = 1;
  thePageSize : number = 5;
  theTotalElements : number = 0;
  

  constructor(private productService : ProductService, private route : ActivatedRoute) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode) {
      this.handleSearchProduct();
    } else {
      this.handleListProduct();
    }
  }
  
  handleSearchProduct() {
    const keyword : string = this.route.snapshot.paramMap.get('keyword')!;
    if(this.previousKeyword != keyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = keyword;
    this.productService.getProductSearchPagination(this.thePageNumber -1, this.thePageSize, keyword).subscribe(this.processResult());
  }

  private handleListProduct() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
    }

    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    // now get the products for the given category id
    this.productService.getProductListPagination(this.thePageNumber-1, this.thePageSize, this.currentCategoryId).subscribe(this.processResult());
  }

  processResult() {
    return (data : any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }

  updatePageSize(pageSize : string) {
    this.thePageSize =+ pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
}
