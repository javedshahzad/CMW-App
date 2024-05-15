import { TestBed } from '@angular/core/testing';

import { VotService } from './vot.service';

describe('VotService', () => {
  let service: VotService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
