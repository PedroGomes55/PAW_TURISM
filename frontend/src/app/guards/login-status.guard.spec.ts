import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loginStatusGuard } from './login-status.guard';

describe('loginStatusGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loginStatusGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
