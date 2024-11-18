import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendPasswordRequestComponent } from './send-password-request.component';

describe('SendPasswordRequestComponent', () => {
  let component: SendPasswordRequestComponent;
  let fixture: ComponentFixture<SendPasswordRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SendPasswordRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SendPasswordRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
