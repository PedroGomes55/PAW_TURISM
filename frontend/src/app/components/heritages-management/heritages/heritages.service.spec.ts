import { TestBed } from '@angular/core/testing';

import { HeritagesService } from './heritages.service';

describe('HeritagesService', () => {
  let service: HeritagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeritagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
