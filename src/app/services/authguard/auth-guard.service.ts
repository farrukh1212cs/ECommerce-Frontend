import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../api/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(
    private authService: AuthApiService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const refreshToken = this.authService.getRefreshToken();

    // If no token and no refresh token, redirect to login
    if (!token && !refreshToken) {
      this.router.navigate(['/auth/login']);
      return false;
    }

    // If no token but refresh token exists, try to refresh
    if (!token && refreshToken) {
      this.attemptTokenRefresh(refreshToken);
      return false; // Wait for refresh attempt
    }

    // If token exists, user is authenticated
    if (token) {
      return true;
    }

    return false;
  }

  private attemptTokenRefresh(refreshToken: string): void {
    this.authService.refresh({ token: '', refreshToken }).subscribe({
      next: () => {
        // Token refreshed successfully, reload current route
        this.router.navigate([this.router.url]);
      },
      error: () => {
        // Refresh failed, redirect to login
        this.authService.logout();
        this.router.navigate(['/auth/login']);
      }
    });
  }
}
