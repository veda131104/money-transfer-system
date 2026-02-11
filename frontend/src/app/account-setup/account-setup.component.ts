import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AccountSetupService } from '../services/account-setup.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-account-setup',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './account-setup.component.html',
  styleUrls: ['./account-setup.component.scss']
})
export class AccountSetupComponent {
  form!: FormGroup;
  lastSentOtp = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly svc: AccountSetupService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      accountNumber: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      creditCardNumber: [''],
      cvv: [''],
      otp: ['']
    });
  }

  sendOtp(): void {
    const contact = this.form.get('email')?.value || '';
    if (!contact) {
      alert('Please enter an email address first');
      return;
    }
    this.svc.sendOtp({ contact }).subscribe(resp => {
      this.lastSentOtp = resp.otp || '';
      // In production do not expose OTP
    });
  }

  verifyOtp(): void {
    const contact = this.form.get('email')?.value || '';
    const otp = this.form.get('otp')?.value || '';
    if (!contact || !otp) {
      alert('Please enter email and OTP');
      return;
    }
    this.svc.verifyOtp({ contact, otp }).subscribe(resp => {
      if (resp.verified) {
        alert('Email verified');
      } else {
        alert('Invalid OTP');
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    const payload = {
      ...this.form.getRawValue(),
      userName: user?.name
    };

    this.svc.create(payload).subscribe({
      next: () => {
        alert('Bank details saved');
        this.router.navigate(['/profile']);
      },
      error: (e) => alert('Error saving: ' + e?.message)
    });
  }
}
