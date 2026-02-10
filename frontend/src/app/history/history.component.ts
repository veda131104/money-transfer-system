import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TransactionService, Transaction } from '../services/transaction.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatCardModule, RouterLink],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  allTransactions: Transaction[] = [];
  displayedTransactions: Transaction[] = [];
  selectedTransaction: Transaction | null = null;
  itemsPerPage: number = 5;
  currentPage: number = 0;
  hasMoreTransactions: boolean = true;

  constructor(private router: Router, private transactionService: TransactionService) {}

  ngOnInit(): void {
    // Initialize with sample data if storage is empty
    if (this.transactionService.getTransactions().length === 0) {
      this.initializeTransactions();
    }
    
    // Subscribe to transactions
    this.transactionService.transactions$.subscribe(() => {
      this.displayedTransactions = [];
      this.currentPage = 0;
      this.loadMore();
    });
    
    this.loadMore();
  }

  initializeTransactions(): void {
    const sampleTransactions: Transaction[] = [
      {
        id: '1',
        accountNumber: '9876543210',
        amount: '5000',
        date: new Date(2026, 1, 10, 14, 30),
        type: 'debit',
        status: 'completed',
        referenceId: 'TXN001',
        description: 'Payment to Vendor'
      },
      {
        id: '2',
        accountNumber: '1234567890',
        amount: '15000',
        date: new Date(2026, 1, 9, 10, 15),
        type: 'credit',
        status: 'completed',
        referenceId: 'TXN002',
        description: 'Salary credit'
      },
      {
        id: '3',
        accountNumber: '5555666677',
        amount: '2500',
        date: new Date(2026, 1, 8, 16, 45),
        type: 'debit',
        status: 'completed',
        referenceId: 'TXN003',
        description: 'Utility bill payment'
      },
      {
        id: '4',
        accountNumber: '1111222233',
        amount: '10000',
        date: new Date(2026, 1, 7, 9, 20),
        type: 'credit',
        status: 'completed',
        referenceId: 'TXN004',
        description: 'Refund processed'
      },
      {
        id: '5',
        accountNumber: '9999888877',
        amount: '3000',
        date: new Date(2026, 1, 6, 13, 10),
        type: 'debit',
        status: 'completed',
        referenceId: 'TXN005',
        description: 'Transfer to friend'
      },
      {
        id: '6',
        accountNumber: '4444555566',
        amount: '7500',
        date: new Date(2026, 1, 5, 11, 55),
        type: 'credit',
        status: 'completed',
        referenceId: 'TXN006',
        description: 'Freelance payment'
      },
      {
        id: '7',
        accountNumber: '7777888899',
        amount: '1200',
        date: new Date(2026, 1, 4, 15, 30),
        type: 'debit',
        status: 'pending',
        referenceId: 'TXN007',
        description: 'Online shopping'
      },
      {
        id: '8',
        accountNumber: '2222333344',
        amount: '8000',
        date: new Date(2026, 1, 3, 12, 0),
        type: 'credit',
        status: 'completed',
        referenceId: 'TXN008',
        description: 'Investment return'
      }
    ];

    sampleTransactions.forEach(t => this.transactionService.addTransaction(t));
  }

  loadMore(): void {
    this.allTransactions = this.transactionService.getTransactions();
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const newTransactions = this.allTransactions.slice(startIndex, endIndex);
    
    this.displayedTransactions = [...this.displayedTransactions, ...newTransactions];
    this.currentPage++;
    
    this.hasMoreTransactions = endIndex < this.allTransactions.length;
  }

  openTransactionDetail(transaction: Transaction, index: number): void {
    this.selectedTransaction = transaction;
  }

  closeTransactionDetail(): void {
    this.selectedTransaction = null;
  }

  addTransaction(transaction: Transaction): void {
    this.allTransactions.unshift(transaction);
    this.displayedTransactions = [];
    this.currentPage = 0;
    this.loadMore();
  }

  onLogout(): void {
    this.router.navigate(['/login']);
  }
}
