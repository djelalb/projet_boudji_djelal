import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environnement/environnement';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCatalogue(): Observable<Product[]> {
    const token = localStorage.getItem('jwtToken') || '';

    console.log('ApiService - Token:', token);

    const headers = token
      ? new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        })
      : new HttpHeaders({
          'Content-Type': 'application/json',
        });

    return this.http.get<Product[]>(`${this.apiUrl}/catalogue`, { headers });
  }
}
