import { TestBed } from '@angular/core/testing';

import { ShowHeritagesService } from './show-heritages.service';

describe('ShowHeritagesService', () => {
  let service: ShowHeritagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowHeritagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
