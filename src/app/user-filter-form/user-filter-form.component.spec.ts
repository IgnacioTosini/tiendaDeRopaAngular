import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFilterFormComponent } from './user-filter-form.component';

describe('UserFilterFormComponent', () => {
  let component: UserFilterFormComponent;
  let fixture: ComponentFixture<UserFilterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserFilterFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UserFilterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
