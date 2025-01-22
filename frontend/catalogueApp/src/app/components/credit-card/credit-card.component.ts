import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskCardNumberPipe } from '../../pipe/mask-card-number.pipe';
import {CarteCredit } from '../../models/cartescredit';

@Component({
  selector: 'app-credit-card',
  standalone: true,
  imports: [CommonModule, MaskCardNumberPipe],
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent {
  @Input() creditCards: any[] = [];
  @Output() deleteCard = new EventEmitter<number>();
  @Output() updateCard = new EventEmitter<{ id: number; carte: Partial<CarteCredit> }>();

  handleDelete(cardId: number): void {
    this.deleteCard.emit(cardId);
  }

  handleUpdate(cardId: number): void {
    const updatedCard = {
      numero_carte: prompt('Entrez le nouveau numéro de carte :'),
      expiration_date: prompt('Entrez la nouvelle date d\'expiration (YYYY-MM-DD) :'),
      titulaire: prompt('Entrez le nouveau titulaire :'),
      cryptogramme: prompt('Entrez le nouveau cryptogramme :'),
    };

    // Filtrer les champs non renseignés
    const filteredUpdates = Object.fromEntries(
      Object.entries(updatedCard).filter(([_, value]) => value !== null && value !== '')
    );

    this.updateCard.emit({ id: cardId, carte: filteredUpdates });
  }
}
