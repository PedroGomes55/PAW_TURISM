import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialNavbarComponent } from './initial-navbar.component';

describe('InitialNavbarComponent', () => {
  let component: InitialNavbarComponent;
  let fixture: ComponentFixture<InitialNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InitialNavbarComponent]
    });
    fixture = TestBed.createComponent(InitialNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
