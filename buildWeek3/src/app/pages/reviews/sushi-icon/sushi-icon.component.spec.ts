import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SushiIconComponent } from './sushi-icon.component';

describe('SushiIconComponent', () => {
  let component: SushiIconComponent;
  let fixture: ComponentFixture<SushiIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SushiIconComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SushiIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
