import { Component, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { TransactionService, Transaction } from '../services/transaction.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './transfer.component.html',
  styleUrl: './transfer.component.scss',
})
export class TransferComponent {
  accountNumber: string = '';
  amount: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  successDetails: { accountNumber: string; amount: string } = {
    accountNumber: '',
    amount: '',
  };

  constructor(private router: Router, private ngZone: NgZone, private cdr: ChangeDetectorRef, private transactionService: TransactionService) {}

  onAccountNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    input.value = value;
    this.accountNumber = value;
  }

  onAmountInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9.]/g, '');
    
    // Ensure only one decimal point
    const parts = value.split('.');
    if (parts.length > 2) {
      input.value = parts[0] + '.' + parts.slice(1).join('');
    } else {
      input.value = value;
    }
    this.amount = input.value;
  }

  onSendMoney(): void {
    // Validation
    if (!this.accountNumber.trim()) {
      alert('Please enter the recipient\'s account number.');
      return;
    }

    if (this.accountNumber.length < 8) {
      alert('Account number must be at least 8 digits.');
      return;
    }

    if (!this.amount.trim()) {
      alert('Please enter the amount to transfer.');
      return;
    }

    const amountValue = parseFloat(this.amount);
    if (amountValue <= 0) {
      alert('Amount must be greater than zero.');
      return;
    }

    // Show loading state
    this.isLoading = true;
    this.successDetails = {
      accountNumber: this.accountNumber,
      amount: this.amount,
    };

    // Simulate transfer processing (2 seconds)
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.isSuccess = true;
          
          // Add transaction to history
          const newTransaction: Transaction = {
            id: Date.now().toString(),
            accountNumber: this.accountNumber,
            amount: this.amount,
            date: new Date(),
            type: 'debit',
            status: 'completed',
            referenceId: this.transactionService.generateReferenceId(),
            description: 'Transfer initiated'
          };
          this.transactionService.addTransaction(newTransaction);
          
          this.cdr.detectChanges();
        });
      }, 2000);
    });
  }

  onNewTransfer(): void {
    // Reset states and form
    this.isSuccess = false;
    this.isLoading = false;
    this.accountNumber = '';
    this.amount = '';
    const inputs = document.querySelectorAll('.transfer input');
    inputs.forEach(input => (input as HTMLInputElement).value = '');
  }

  onCheckHistory(): void {
    // Navigate to history page
    this.router.navigate(['/history']);
  }

  onLogout(): void {
    // Clear session and redirect to login
    this.router.navigate(['/login']);
  }
}
