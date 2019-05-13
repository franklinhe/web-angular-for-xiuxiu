import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSearchTypeComponent } from './app-search-type.component';

describe('AppSearchTypeComponent', () => {
  let component: AppSearchTypeComponent;
  let fixture: ComponentFixture<AppSearchTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppSearchTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSearchTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
