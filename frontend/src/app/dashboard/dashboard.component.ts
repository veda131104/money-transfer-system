import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, RouterLink, RouterLinkActive],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  routerLinkActiveOptions = { exact: true };
  userName = 'Aarav Sharma';

  constructor(private router: Router, private authService: AuthService) {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name;
    }
  }

  onLogout(): void {
    this.authService.clearSession();
    this.router.navigate(['/']);
  }
}
