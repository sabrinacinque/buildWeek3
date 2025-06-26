import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContoFinaleModalComponent } from './conto-finale-modal.component';

describe('ContoFinaleModalComponent', () => {
  let component: ContoFinaleModalComponent;
  let fixture: ComponentFixture<ContoFinaleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContoFinaleModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContoFinaleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
