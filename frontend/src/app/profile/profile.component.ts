import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AccountSetupService } from '../services/account-setup.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  routerLinkActiveOptions = { exact: true };
  isNewUser = false;
  isEditing = false;
  profileForm!: FormGroup;

  profileData = {
    name: '',
    accountNumber: 'N/A',
    email: 'N/A',
    phoneNumber: 'N/A',
    address: 'N/A',
    bankName: 'N/A',
    branchName: 'N/A',
    ifscCode: 'N/A',
    upiId: 'N/A',
    accountType: 'Savings Account',
    accountStatus: 'Active',
    joinDate: 'N/A',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private accountSetupService: AccountSetupService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.profileData.name = user.name;
      this.checkAccountStatus(user.name);
    } else {
      this.router.navigate(['/']);
    }

    this.profileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      bankName: ['', [Validators.required]],
      branchName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      creditCardNumber: [''],
      cvv: [''],
    });
  }

  checkAccountStatus(userName: string): void {
    this.accountSetupService.getAccountByUser(userName).subscribe({
      next: (data) => {
        this.isNewUser = false;
        this.profileData = { ...this.profileData, ...data };
        this.profileForm.patchValue(data);
      },
      error: () => {
        this.isNewUser = true;
        this.profileData.accountStatus = 'Pending Setup';
      }
    });
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/']);
  }

  onEditProfile(): void {
    if (this.isNewUser) {
      this.router.navigate(['/account-setup']);
    } else {
      this.isEditing = true;
    }
  }

  onSave(): void {
    if (this.profileForm.invalid) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.accountSetupService.updateAccount(user.name, this.profileForm.value).subscribe({
      next: (data) => {
        this.profileData = { ...this.profileData, ...data };
        this.isEditing = false;
        alert('Profile updated successfully!');
      },
      error: (e) => alert('Update failed: ' + e?.message)
    });
  }

  onCancel(): void {
    this.isEditing = false;
    this.profileForm.patchValue(this.profileData);
  }

  getInitials(): string {
    if (!this.profileData.name) return 'U';
    const names = this.profileData.name.split(' ');
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
    }
    return this.profileData.name.charAt(0).toUpperCase();
  }
}
