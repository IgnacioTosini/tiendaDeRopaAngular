import { TestBed } from '@angular/core/testing';

import { SkeletonServiceService } from './skeleton-service.service';

describe('SkeletonServiceService', () => {
  let service: SkeletonServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SkeletonServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
