import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './user.model';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { UIService } from '../shared/ui.service';
import { environment } from '../../environments/environment';

/**
 * API URL
 */
const API_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new BehaviorSubject<boolean>(
    this.isAuthenticated
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private uiService: UIService
  ) {}

  /**
   * Get token.
   */
  getToken() {
    return this.token;
  }

  /**
   * Get authenticathion status.
   */
  getIsAuth() {
    return this.isAuthenticated;
  }

  /**
   * Listen to changes in authentication status.
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  /**
   * Create user.
   */
  signup(username: string, email: string, password: string, confirmPassword: string) {
    this.uiService.loadingStateChanged.next(true);
    const authData: User = { username, email, password, confirmPassword };
    this.http.post(`${API_URL}signup`, authData).subscribe(
      response => {
        this.router.navigate(['/user/login']);
        this.uiService.loadingStateChanged.next(false);
      },
      error => {
        this.uiService.loadingStateChanged.next(false);
      }
    );
  }

  /**
   * Log in user.
   */
  login(email: string, password: string) {
    this.uiService.loadingStateChanged.next(true);
    const authData: User = { email, password };
    this.http
      .post<{ token: string; expiresIn: number }>(`${API_URL}login`, authData)
      .subscribe(
        response => {
          const token = response.token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.token = token;
            this.isAuthenticated = true;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate);
            this.uiService.showSnackBar(
              'Logged in successfully!',
              null,
              3000,
              'bottom'
            );
            this.uiService.loadingStateChanged.next(true);
            this.router.navigate(['/board']);
          }
        },
        error => {
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

  /**
   * Auto user authentication.
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  /**
   * Log out user.
   */
  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.uiService.showSnackBar(
      'Logged out successfully!',
      null,
      3000,
      'bottom'
    );
    this.router.navigate(['/']);
  }

  /**
   * Set authentication timer.
   */
  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  /**
   * Save authentication data in local storage.
   */
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  /**
   * Clear authentication data from local storage.
   */
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  /**
   * Get authentication data.
   */
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token,
      expirationDate: new Date(expirationDate)
    };
  }
}
