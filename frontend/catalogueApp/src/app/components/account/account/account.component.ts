import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CreditCardComponent } from '../../credit-card/credit-card.component';
import { AddCreditCardComponent } from '../../../add-credit-card/add-credit-card.component';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, CreditCardComponent, AddCreditCardComponent],
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

  viewOrderHistory() {
    this.router.navigate(['/order-history']);
  }

  confirmDeleteAccount() {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ?')) {
      if (this.user && this.user.id) {
        console.log('Suppression du compte utilisateur', this.user.id);
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

  deleteCreditCard(cardId: number) {
    this.apiService.deleteCarteCredit(cardId).subscribe(
      () => {
        this.creditCards = this.creditCards.filter(card => card.id !== cardId);
        alert('Carte supprimée avec succès!');
      },
      (error) => {
        console.error('Erreur lors de la suppression de la carte de crédit', error);
      }
    );
  }

  handleCardAdded(newCard: any) {
    this.apiService.createCarteCredit(newCard).subscribe(
      (response) => {
        const addedCard = {
          ...newCard,
          ...response
        };

        this.creditCards.push(addedCard);
        alert('Carte de crédit ajoutée avec succès!');
      },
      (error) => {
        console.error('Erreur lors de l\'ajout de la carte de crédit', error);
      }
    );
  }
}
