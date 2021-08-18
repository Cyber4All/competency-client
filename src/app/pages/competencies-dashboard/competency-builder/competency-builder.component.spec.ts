import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetencyBuilderComponent } from './competency-builder.component';

describe('CompetencyBuilderComponent', () => {
  let component: CompetencyBuilderComponent;
  let fixture: ComponentFixture<CompetencyBuilderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetencyBuilderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetencyBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
