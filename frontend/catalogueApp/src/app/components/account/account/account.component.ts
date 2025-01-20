import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css'],
})
export class AccountComponent implements OnInit {
  user: any = null;
  editableUser: any = {};
  currentSection: string = 'personalInfo';
  isEditingPersonalInfo: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      } else {
        this.user = this.authService.getCurrentUser();
        this.editableUser = { ...this.user };
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

  enableEdit() {
    this.isEditingPersonalInfo = true;
    this.editableUser = { ...this.user };
  }

  cancelEdit() {
    this.isEditingPersonalInfo = false;
  }

  onUpdatePersonalInfo() {
    this.authService.updateUser(this.editableUser).subscribe(
      (updatedUser) => {
        this.user = updatedUser;
        this.isEditingPersonalInfo = false;
      },
      (error) => {
        console.error("Erreur lors de la mise à jour des informations :", error);
      }
    );
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
