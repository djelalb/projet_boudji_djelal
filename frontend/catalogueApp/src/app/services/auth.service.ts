import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environnement/environnement';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private accessToken: string = '';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private currentUser: { login: string } | null = null;

  constructor(private http: HttpClient) {
    // Vérifier si un token est présent lors du démarrage et mettre à jour l'état d'authentification
    if (this.getAccessToken()) {
      this.isAuthenticatedSubject.next(true);
      this.currentUser = this.getCurrentUser();
    }
  }

  login(credentials: { login: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/utilisateur/login`, credentials).pipe(
      tap((response: any) => {
        if (response.token) {
          this.storeAccessToken(response.token);
          this.setCurrentUser(response.user);
          this.isAuthenticatedSubject.next(true);
        } else {
          console.error('Token non trouvé dans la réponse');
        }
      })
    );
  }

  storeAccessToken(token: string): void {
    this.accessToken = token;
    localStorage.setItem('jwtToken', token);
  }

  getAccessToken(): string {
    return this.accessToken || localStorage.getItem('jwtToken') || '';
  }

  signup(user: { login: string; password: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/utilisateur/signup`, user);
  }

  logout(): void {
    this.accessToken = '';
    this.currentUser = null;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   */
  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  /**
   * Définir l'utilisateur actuel après connexion
   */
  private setCurrentUser(user: { login: string }): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Récupérer l'utilisateur actuellement connecté
   */
  getCurrentUser(): { login: string } | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.currentUser;
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/utilisateur/delete`);
  }
}
