import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployabilityCardComponent } from './employability-card.component';

describe('EmployabilityCardComponent', () => {
  let component: EmployabilityCardComponent;
  let fixture: ComponentFixture<EmployabilityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployabilityCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployabilityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
