import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  newUser = { login: '', password: '' };
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
