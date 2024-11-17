import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClotheComponent } from './create-clothe.component';

describe('CreateClotheComponent', () => {
  let component: CreateClotheComponent;
  let fixture: ComponentFixture<CreateClotheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClotheComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateClotheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
