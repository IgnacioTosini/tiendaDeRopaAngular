import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreateProductPageComponent } from './view-create-product-page.component';

describe('ViewCreateProductPageComponent', () => {
  let component: ViewCreateProductPageComponent;
  let fixture: ComponentFixture<ViewCreateProductPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCreateProductPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewCreateProductPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
