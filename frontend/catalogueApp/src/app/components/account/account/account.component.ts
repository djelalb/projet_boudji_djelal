import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service'; // Importer ApiService
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
  isPhoneValid: boolean = false;

  creditCards: any[] = [];
  newCard: any = { utilisateur_id: '', numero_carte: '', expiration_date: '', titulaire: '', cryptogramme: '' };

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated().subscribe((isAuth) => {
      if (!isAuth) {
        this.router.navigate(['/login']);
      } else {
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && currentUser.id) {
          this.user = currentUser;
          this.newCard.utilisateur_id = this.user.id;
          this.editableUser = { ...this.user };
          this.loadCreditCards();
        } else {
          console.error('Utilisateur invalide ou ID manquant');
        }
      }
    });
  }

  loadCreditCards() {
    this.apiService.getCartesCredit(this.user.id).subscribe(
      (cards) => {
        this.creditCards = cards;
      },
      (error) => {
        console.error('Erreur lors du chargement des cartes de crédit', error);
      }
    );
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
    if (!this.validateCardData(this.newCard)) {
      alert('Les données de la carte sont invalides.');
      return;
    }

    this.apiService.createCarteCredit(this.newCard).subscribe(
      (response) => {
        this.creditCards.push(response);
        this.newCard = { utilisateur_id: this.user.id, numero_carte: '', expiration_date: '', titulaire: '', cryptogramme: '' };
        alert('Carte de crédit ajoutée avec succès!');
      },
      (error) => {
        console.error("Erreur lors de l'ajout de la carte de crédit", error);
      }
    );
  }

  validateCardData(card: any): boolean {
    if (!/^\d{13,16}$/.test(card.numero_carte)) {
      console.error("Numéro de carte invalide.");
      return false;
    }
    if (!/^\d{3}$/.test(card.cryptogramme)) {
      console.error("Cryptogramme invalide.");
      return false;
    }
    if (card.titulaire.trim().length === 0) {
      console.error("Le nom du titulaire est requis.");
      return false;
    }
    return true;
  }

  deleteCreditCard(cardId: number) {
    this.apiService.deleteCarteCredit(cardId).subscribe(
      () => {
        this.creditCards = this.creditCards.filter(card => card.id !== cardId);  // Supprimer la carte de la liste
        alert('Carte supprimée avec succès!');
      },
      (error) => {
        console.error('Erreur lors de la suppression de la carte de crédit', error);
      }
    );
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
