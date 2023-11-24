import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowHeritageComponent } from './show-heritage.component';

describe('ShowHeritageComponent', () => {
  let component: ShowHeritageComponent;
  let fixture: ComponentFixture<ShowHeritageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowHeritageComponent]
    });
    fixture = TestBed.createComponent(ShowHeritageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
