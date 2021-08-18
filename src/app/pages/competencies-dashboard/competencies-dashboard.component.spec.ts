import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciesDashboardComponent } from './competencies-dashboard.component';

describe('CompetenciesDashboardComponent', () => {
  let component: CompetenciesDashboardComponent;
  let fixture: ComponentFixture<CompetenciesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetenciesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetenciesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
