import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  newUser = {
    prenom: '',
    nom: '',
    login: '',
    password: '',
    email: '',
    adresse: '',
    telephone: '',
  };
  error: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.authService.signup(this.newUser).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du compte.';
        console.error(err);
      },
    });
  }
}
