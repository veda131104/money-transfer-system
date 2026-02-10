import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  routerLinkActiveOptions = { exact: true };

  profileData = {
    name: 'Aarav Sharma',
    accountNumber: '1234567890',
    email: 'aarav.sharma@example.com',
    phoneNumber: '+91 98765 43210',
    address: '123 Financial District, Mumbai, Maharashtra 400001, India',
    bankName: 'ICICI Bank Limited',
    branchName: 'Mumbai Central Branch',
    ifscCode: 'ICIC0000001',
    upiId: 'aarav.sharma@icici',
    accountType: 'Savings Account',
    accountStatus: 'Active',
    joinDate: 'January 15, 2020',
  };

  constructor(private router: Router) {}

  onLogout(): void {
    // Implement logout logic
    this.router.navigate(['']);
  }

  onEditProfile(): void {
    // Placeholder for edit functionality
    alert('Edit profile functionality coming soon');
  }
}
