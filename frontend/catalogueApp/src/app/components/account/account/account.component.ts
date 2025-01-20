import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  user: any = null;
  currentSection: string = 'personalInfo';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      } else {
        this.user = this.authService.getCurrentUser();
      }
    });
  }

  showSection(section: string): void {
    this.currentSection = section;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  editPersonalInfo() {
    this.router.navigate(['/edit-profile']);
  }

  addCreditCard() {
    this.router.navigate(['/add-credit-card']);
  }

  viewOrderHistory() {
    this.router.navigate(['/order-history']);
  }

  confirmDeleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      this.authService.deleteAccount().subscribe(() => {
        this.logout();
        this.router.navigate(['/login']);
      });
    }
  }
}
