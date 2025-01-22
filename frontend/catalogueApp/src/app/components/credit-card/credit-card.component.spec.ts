import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCartComponent } from './credit-card.component';

describe('CreditCartComponent', () => {
  let component: CreditCartComponent;
  let fixture: ComponentFixture<CreditCartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
