import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maskCardNumber',
  standalone: true
})
export class MaskCardNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const visibleDigits = 4;
    const maskedSection = '*'.repeat(value.length - visibleDigits);
    const visibleSection = value.slice(-visibleDigits);
    return maskedSection + visibleSection;
  }
}
