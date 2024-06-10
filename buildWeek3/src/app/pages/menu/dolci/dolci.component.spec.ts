import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DolciComponent } from './dolci.component';

describe('DolciComponent', () => {
  let component: DolciComponent;
  let fixture: ComponentFixture<DolciComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DolciComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DolciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
