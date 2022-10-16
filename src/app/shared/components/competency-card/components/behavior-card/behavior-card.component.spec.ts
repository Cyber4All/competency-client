import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BehaviorCardComponent } from './behavior-card.component';

describe('BehaviorCardComponent', () => {
  let component: BehaviorCardComponent;
  let fixture: ComponentFixture<BehaviorCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BehaviorCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BehaviorCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
