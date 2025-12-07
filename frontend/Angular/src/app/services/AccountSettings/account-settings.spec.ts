import { TestBed } from '@angular/core/testing';

import { AccountSettingsService } from './account-settings'

describe('AccountSettings', () => {
  let service: AccountSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
