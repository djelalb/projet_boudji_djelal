import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  private currentUser: { id: number; login: string } | null = null;

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

  // Récupération du token JWT depuis le localStorage
    private getAuthHeaders(): HttpHeaders {
      const token = localStorage.getItem('jwtToken') || '';
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });
    }

  signup(user: { login: string; password: string; nom: string; prenom: string; email: string; adresse?: string; telephone?: string }): Observable<any> {
    return this.http.post(`${environment.apiUrl}/utilisateur/signup`, user);
  }

  logout(): void {
    this.accessToken = '';
    this.currentUser = null;
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('currentUser');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$;
  }

  private setCurrentUser(user: { id: number; login: string }): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  getCurrentUser(): { id: number; login: string } | null {
    if (!this.currentUser) {
      const storedUser = localStorage.getItem('currentUser');
      this.currentUser = storedUser ? JSON.parse(storedUser) : null;
    }
    return this.currentUser;
  }

  updateUser(user: { id: number; nom?: string; prenom?: string; email?: string; adresse?: string; telephone?: string }): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${environment.apiUrl}/utilisateur/${user.id}`, user, { headers }).pipe(
      tap((updatedUser: any) => {
        if (this.currentUser && updatedUser) {
          // Mettez à jour les informations utilisateur dans le localStorage
          this.currentUser = { ...this.currentUser, ...updatedUser };
          localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
      })
    );
  }

  deleteAccount(userId: number): Observable<any> {
    console.log('Suppression du compte utilisateur', userId);
    const headers = this.getAuthHeaders();
    return this.http.delete(`${environment.apiUrl}/utilisateur/${userId}`, { headers }).pipe(
      tap(() => {
        this.logout();
      })
    );
  }
}
