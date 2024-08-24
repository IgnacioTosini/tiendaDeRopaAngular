import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({});

  constructor(private formBuilder: FormBuilder, private userService: UserService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (!this.loginForm.valid) {
      console.log('Invalid form data');
      return;
    }

    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(response => {
      console.log('User:', response);
      if (response) {
        this.userService.getUserByEmail(response.username, response.token).subscribe(user => {
          console.log(user);
          this.authService.handleLoginResponse(response);
        }, error => {
          console.error('Error fetching user by email:', error);
        });
      } else {
        console.log('User not found');
      }
    }, error => {
      console.error('Login error:', error);
    });
  }
}
