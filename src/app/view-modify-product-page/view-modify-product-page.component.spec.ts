import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewModifyProductPageComponent } from './view-modify-product-page.component';

describe('ViewModifyProductPageComponent', () => {
  let component: ViewModifyProductPageComponent;
  let fixture: ComponentFixture<ViewModifyProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewModifyProductPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewModifyProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
