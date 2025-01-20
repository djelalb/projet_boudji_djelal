import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CatalogueService {
  constructor(private authService: AuthService, private apiService: ApiService) {}

  getCatalogue(): Observable<Product[]> {
    return this.apiService.getCatalogue().pipe(
      catchError((error) => {
        console.error('Erreur lors du chargement du catalogue', error);
        return of([]); // Retourne un tableau vide en cas d'erreur
      })
    );
  }
}
