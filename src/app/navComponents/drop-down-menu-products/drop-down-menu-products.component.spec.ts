import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropDownMenuProductsComponent } from './drop-down-menu-products.component';

describe('DropDownMenuProductsComponent', () => {
  let component: DropDownMenuProductsComponent;
  let fixture: ComponentFixture<DropDownMenuProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropDownMenuProductsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropDownMenuProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
