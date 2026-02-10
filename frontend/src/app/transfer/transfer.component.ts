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
  description: string = '';
  isLoading: boolean = false;
  isSuccess: boolean = false;
  successDetails: { accountNumber: string; amount: string } = {
    accountNumber: '',
    amount: '',
  };
  // PIN modal state
  showPinModal: boolean = false;
  pin: string = '';
  pinMessage: string = '';
  pinLoading: boolean = false;
  pinVisible: boolean = false;
  pinErrorTimer: any = null;
  routerLinkActiveOptions = { exact: true };

  constructor(private router: Router, private ngZone: NgZone, private cdr: ChangeDetectorRef, private transactionService: TransactionService) {}

  onAccountNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 12);
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

  onDescriptionInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.description = input.value;
  }

  onSendMoney(): void {
    // Validation
    if (!this.accountNumber.trim()) {
      alert('Please enter the recipient\'s account number.');
      return;
    }

    if (this.accountNumber.length < 12) {
      alert('Account number must be exactly 12 digits.');
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

    // Open PIN modal (keep transfer details ready)
    this.successDetails = {
      accountNumber: this.accountNumber,
      amount: this.amount,
    };
    this.pin = '';
    this.pinMessage = '';
    this.showPinModal = true;
  }

  onPinInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '').slice(0, 4);
    this.pin = input.value;
  }

  togglePinVisibility(): void {
    this.pinVisible = !this.pinVisible;
  }

  onConfirmPin(): void {
    if (!this.pin || this.pin.length < 4) {
      this.pinMessage = 'Please enter a 4-digit PIN.';
      return;
    }

    const CORRECT_PIN = '1234';
    if (this.pin !== CORRECT_PIN) {
      // Add failed transaction to history
      const failedTxn: Transaction = {
        id: Date.now().toString(),
        accountNumber: this.accountNumber,
        amount: this.amount,
        date: new Date(),
        type: 'debit',
        status: 'failed',
        referenceId: this.transactionService.generateReferenceId(),
        description: 'Incorrect PIN'
      };
      this.transactionService.addTransaction(failedTxn);
      this.pinMessage = 'Incorrect PIN. Transaction failed.';
      this.pin = '';
      this.pinVisible = false;
      // Auto-close modal after 5 seconds
      if (this.pinErrorTimer) clearTimeout(this.pinErrorTimer);
      this.pinErrorTimer = setTimeout(() => {
        this.closePinModal();
      }, 5000);
      return;
    }

    // Correct PIN: show buffering UI and complete transfer
    this.pinLoading = true;
    this.pinMessage = '';
    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.ngZone.run(() => {
          this.pinLoading = false;
          this.showPinModal = false;
          this.isLoading = false;
          this.isSuccess = true;

          const newTransaction: Transaction = {
            id: Date.now().toString(),
            accountNumber: this.accountNumber,
            amount: this.amount,
            date: new Date(),
            type: 'debit',
            status: 'completed',
            referenceId: this.transactionService.generateReferenceId(),
            description: 'Transfer completed'
          };
          this.transactionService.addTransaction(newTransaction);
          this.cdr.detectChanges();
        });
      }, 2000);
    });
  }

  closePinModal(): void {
    if (this.pinErrorTimer) clearTimeout(this.pinErrorTimer);
    this.showPinModal = false;
    this.pin = '';
    this.pinMessage = '';
  }

  onNewTransfer(): void {
    // Reset states and form
    this.isSuccess = false;
    this.isLoading = false;
    this.accountNumber = '';
    this.amount = '';
    this.description = '';
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
