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
  isEmailValid: boolean = true;
  isPhoneValid: boolean = false;
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
    this.isEmailValid = this.validateEmail(this.newUser.email);
    this.isPhoneValid = this.validatePhone(this.newUser.telephone);

    if (!this.isEmailValid || !this.isPhoneValid) {
      return;
    }

    if (!this.newUser.login || !this.newUser.password) {
      this.error = 'Veuillez renseigner un identifiant et un mot de passe.';
      return;
    }

    this.authService.signup(this.newUser).subscribe({
      next: () => {
        alert('Compte créé avec succès.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du compte.';
        console.error(err);
      },
    });
  }

  validateEmail(email: string): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
  }

  validatePhone(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone);
  }
}
