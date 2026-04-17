import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://3.86.121.47:8085/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl);
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  createProduct(product: Omit<Product, 'idProducto'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product);
  }

  updateProduct(id: number, product: Omit<Product, 'idProducto'>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
  }

  eliminarProducto(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/eliminar`, {});
  }

  restaurarProducto(id: number): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/restaurar`, {});
  }
}