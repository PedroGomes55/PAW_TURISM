import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeritagesComponent } from './heritages.component';

describe('HeritagesComponent', () => {
  let component: HeritagesComponent;
  let fixture: ComponentFixture<HeritagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeritagesComponent]
    });
    fixture = TestBed.createComponent(HeritagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
