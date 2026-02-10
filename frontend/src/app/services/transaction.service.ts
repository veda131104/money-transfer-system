import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Transaction {
  id: string;
  accountNumber: string;
  amount: string;
  date: Date;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  referenceId: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  public transactions$ = this.transactionsSubject.asObservable();

  constructor() {
    this.loadTransactionsFromStorage();
  }

  private loadTransactionsFromStorage(): void {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    const stored = localStorage.getItem('transactions');
    if (stored) {
      try {
        const transactions = JSON.parse(stored).map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        this.transactionsSubject.next(transactions);
      } catch (e) {
        console.error('Error loading transactions from storage', e);
      }
    }
  }

  private saveTransactionsToStorage(): void {
    // Check if localStorage is available (browser environment)
    if (typeof localStorage === 'undefined') {
      return;
    }
    
    localStorage.setItem('transactions', JSON.stringify(this.transactionsSubject.value));
  }

  addTransaction(transaction: Transaction): void {
    const current = this.transactionsSubject.value;
    const updated = [transaction, ...current];
    this.transactionsSubject.next(updated);
    this.saveTransactionsToStorage();
  }

  getTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  generateReferenceId(): string {
    return 'TXN' + Date.now().toString().slice(-6);
  }
}
