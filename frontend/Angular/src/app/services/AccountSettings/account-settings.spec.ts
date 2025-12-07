import { TestBed } from '@angular/core/testing';

import { AccountSettings } from './account-settings'

describe('AccountSettings', () => {
  let service: AccountSettings;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountSettings);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
