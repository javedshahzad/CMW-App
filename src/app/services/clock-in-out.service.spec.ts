import { TestBed } from '@angular/core/testing';

import { ClockInOutService } from './clock-in-out.service';

describe('ClockInOutService', () => {
  let service: ClockInOutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClockInOutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
