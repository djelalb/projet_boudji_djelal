import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment, environmentprod } from '../environnement/environnement';
import { Product } from '../models/product';
import { CarteCredit } from '../models/cartescredit';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Récupération du token JWT depuis le localStorage
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwtToken') || '';
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  // Catalogue de produits
  getCatalogue(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/catalogue`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Cartes de crédit
  getCartesCredit(utilisateurId: number): Observable<CarteCredit[]> {
    return this.http.get<CarteCredit[]>(`${this.apiUrl}/cartes`, {
      headers: this.getAuthHeaders(),
      params: { utilisateur_id: utilisateurId.toString() },
    });
  }

  getCarteCreditById(id: number): Observable<CarteCredit> {
    return this.http.get<CarteCredit>(`${this.apiUrl}/cartes/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }

  createCarteCredit(carte: CarteCredit, userId: number): Observable<CarteCredit> {
    const body = { ...carte, utilisateur_id: userId };
    return this.http.post<CarteCredit>(`${this.apiUrl}/cartes`, body, {
      headers: this.getAuthHeaders(),
    });
  }

  updateCarteCredit(id: number, carte: Partial<CarteCredit>): Observable<CarteCredit> {
    return this.http.put<CarteCredit>(`${this.apiUrl}/cartes/${id}`, carte, {
      headers: this.getAuthHeaders(),
    });
  }

  deleteCarteCredit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cartes/${id}`, {
      headers: this.getAuthHeaders(),
    });
  }
}
