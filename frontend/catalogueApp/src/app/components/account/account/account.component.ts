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
  isEmailValid: boolean = true;
  isPhoneValid: boolean = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      } else {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
          this.user = currentUser;
          this.editableUser = { ...this.user };
        } else {
          console.error('Utilisateur invalide ou ID manquant');
        }
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
    this.isEmailValid = this.validateEmail(this.editableUser.email);
    this.isPhoneValid = this.validatePhone(this.editableUser.telephone);

    if (!this.isEmailValid || !this.isPhoneValid) {
      return;
    }

    this.authService.updateUser(this.editableUser).subscribe(
      () => {
        this.user = { ...this.user, ...this.editableUser };
        localStorage.setItem('currentUser', JSON.stringify(this.user));
        this.isEditingPersonalInfo = false;
        alert("Informations mises à jour !");
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
      if (this.user && this.user.id) {
        this.authService.deleteAccount(this.user.id).subscribe(
          () => {
            this.logout();
            this.router.navigate(['/login']);
          },
          (error) => {
            console.error('Erreur lors de la suppression du compte :', error);
          }
        );
      } else {
        console.error('L’objet utilisateur est invalide ou ne contient pas de champ id.');
      }
    }
  }

  validateEmail(email: string): boolean {
    return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email);
  }

  validatePhone(phone: string): boolean {
    return /^[0-9]{10}$/.test(phone);
  }
}
