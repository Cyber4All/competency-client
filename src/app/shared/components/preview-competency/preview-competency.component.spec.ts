import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewCompetencyComponent } from './preview-competency.component';

describe('PreviewCompetencyComponent', () => {
  let component: PreviewCompetencyComponent;
  let fixture: ComponentFixture<PreviewCompetencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreviewCompetencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewCompetencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
