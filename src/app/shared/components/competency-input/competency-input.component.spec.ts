import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyInputComponent } from './competency-input.component';

describe('CompetencyInputComponent', () => {
  let component: CompetencyInputComponent;
  let fixture: ComponentFixture<CompetencyInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
