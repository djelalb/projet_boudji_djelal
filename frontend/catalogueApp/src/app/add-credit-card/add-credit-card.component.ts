import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-credit-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-credit-card.component.html',
  styleUrls: ['./add-credit-card.component.css']
})
export class AddCreditCardComponent {
  @Input() userId: string | undefined;
  @Output() cardAdded = new EventEmitter<any>();

  newCard: any = { utilisateur_id: '', numero_carte: '', expiration_date: '', titulaire: '', cryptogramme: '' };

  addCreditCard() {
    if (!this.validateCardData(this.newCard)) {
      alert('Les données de la carte sont invalides.');
      return;
    }

    this.newCard.utilisateur_id = this.userId;
    this.cardAdded.emit(this.newCard);
    this.newCard = { utilisateur_id: this.userId, numero_carte: '', expiration_date: '', titulaire: '', cryptogramme: '' };
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
}
