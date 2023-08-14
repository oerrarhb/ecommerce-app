import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private productCategoriesUrl = 'http://localhost:8080/api/product-category';


  constructor(private httpClient: HttpClient) {

  }

  getProductList(theCategoryId: number): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getSearchResults(searchUrl);
  }

  getProductSearchList(keyword: string | null): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
    return this.getSearchResults(searchUrl);
  }


  private getSearchResults(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.productCategoriesUrl).pipe(
      map(response => response._embedded.productCategory));
  }

  getProduct(productId: number) : Observable<Product>{
    const searchUrl = `${this.baseUrl}/${productId}`;
    return this.httpClient.get<Product>(searchUrl);
  }

}

interface GetResponseProducts {
  _embedded: {
    products: Product[],
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[],
  }
}

