import { TestBed } from '@angular/core/testing';

import { AddRequestSwapService } from './add-request-swap.service';

describe('AddRequestSwapService', () => {
  let service: AddRequestSwapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddRequestSwapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
