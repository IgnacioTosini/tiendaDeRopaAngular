import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClotheItemComponent } from './clothe-item.component';

describe('ClotheItemComponent', () => {
  let component: ClotheItemComponent;
  let fixture: ComponentFixture<ClotheItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClotheItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClotheItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
