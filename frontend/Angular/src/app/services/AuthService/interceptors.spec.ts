import { TestBed } from '@angular/core/testing';

import { Interceptors } from './interceptors';

describe('Interceptors', () => {
  let service: Interceptors;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Interceptors);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
