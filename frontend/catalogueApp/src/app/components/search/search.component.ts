import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  searchTerm: string = '';
  searchCategory: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  @Output() searchEvent = new EventEmitter<any>();

  search() {
    this.searchEvent.emit({
      term: this.searchTerm,
      category: this.searchCategory,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }

  reset() {
    this.searchTerm = '';
    this.searchCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.search();
  }
}
