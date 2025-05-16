import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:8081/api';

  constructor(private http: HttpClient) {}

  /**
   * Get the full API URL for a specific endpoint
   * @param endpoint The API endpoint (without leading slash)
   * @returns The full API URL
   */
  getUrl(endpoint: string): string {
    // Make sure endpoint doesn't start with a slash
    const path = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.API_URL}/${path}`;
  }

  /**
   * Perform a GET request
   * @param endpoint The API endpoint
   * @param params Optional query parameters
   * @returns Observable with the response
   */
  get<T>(endpoint: string, params?: any): Observable<T> {
    return this.http.get<T>(this.getUrl(endpoint), { params });
  }

  /**
   * Perform a POST request
   * @param endpoint The API endpoint
   * @param body The request body
   * @returns Observable with the response
   */
  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(this.getUrl(endpoint), body);
  }

  /**
   * Perform a PUT request
   * @param endpoint The API endpoint
   * @param body The request body
   * @returns Observable with the response
   */
  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(this.getUrl(endpoint), body);
  }

  /**
   * Perform a DELETE request
   * @param endpoint The API endpoint
   * @returns Observable with the response
   */
  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(this.getUrl(endpoint));
  }
} 