import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInvoicesPageComponent } from './view-invoices-page.component';

describe('ViewInvoicesPageComponent', () => {
  let component: ViewInvoicesPageComponent;
  let fixture: ComponentFixture<ViewInvoicesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewInvoicesPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewInvoicesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
