import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// Try to read API base url from environment; fallback to '/api' when not set
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Match backend ProductDto
export interface ProductDto {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
}

interface ApiListResponse<T> {
  fromCache: boolean;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class ProductApiService {
  private baseUrl = environment.baseUrl + '/products';

  constructor(private http: HttpClient) {}

  // Returns product[] (unwrapped from { fromCache, data })
  list(): Observable<ProductDto[]> {
    return this.http
      .get<ApiListResponse<ProductDto[]>>(this.baseUrl)
      .pipe(map((res) => res.data));
  }

  // Returns single product (unwrapped)
  get(id: string): Observable<ProductDto> {
    return this.http
      .get<ApiListResponse<ProductDto>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  // Create returns created product (controller returns dto in body)
  create(product: ProductDto): Observable<ProductDto> {
    return this.http.post<ProductDto>(this.baseUrl, product);
  }

  // Update returns no content; use void
  update(id: string, product: ProductDto): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
