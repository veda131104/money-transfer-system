import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HistoryComponent } from './history/history.component';
import { TransferComponent } from './transfer/transfer.component';
import { PinConfirmComponent } from './pin-confirm/pin-confirm.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'history', component: HistoryComponent },
  { path: 'transfer', component: TransferComponent },
  { path: 'pin-confirm', component: PinConfirmComponent },
];
