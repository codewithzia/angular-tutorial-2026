import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register.component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = '';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      displayName: [''],
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const data = this.registerForm.value;
      this.authService
        .register(data.email, data.password, data.displayName)
        .then(() => {
          this.router.navigate(['/home']);
        })
        .catch((err) => {
          this.errorMessage = err.message || 'Registration failed';
        });
    }
  }
}
