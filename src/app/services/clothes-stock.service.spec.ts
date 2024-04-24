import { TestBed } from '@angular/core/testing';

import { ClothesStockService } from './clothes-stock.service';

describe('ClothesStockService', () => {
  let service: ClothesStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothesStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
