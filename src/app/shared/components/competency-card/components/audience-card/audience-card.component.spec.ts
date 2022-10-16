import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudienceCardComponent } from './audience-card.component';

describe('AudienceCardComponent', () => {
  let component: AudienceCardComponent;
  let fixture: ComponentFixture<AudienceCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudienceCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AudienceCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
