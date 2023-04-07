import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilteringDropdownsComponent } from './filtering-dropdowns.component';

describe('FilteringDropdownsComponent', () => {
  let component: FilteringDropdownsComponent;
  let fixture: ComponentFixture<FilteringDropdownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilteringDropdownsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilteringDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
