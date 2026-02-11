import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadTransactionsFromStorage();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private loadTransactionsFromStorage(): void {
    if (!this.isBrowser()) {
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
    if (!this.isBrowser()) {
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
