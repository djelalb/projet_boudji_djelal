import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaskCardNumberPipe } from '../../pipe/mask-card-number.pipe';

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

  handleDelete(cardId: number): void {
    this.deleteCard.emit(cardId);
  }
}
