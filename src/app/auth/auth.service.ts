import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { IUser } from './user.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UIService } from '../shared/ui.service';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

type UserResponseType = HttpResponse<{ user: IUser }>;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL = environment.apiUrl + '/auth';
  private token: string;
  private isAuthenticated = false;
  private tokenTimer: any;
  private authStatusListener = new BehaviorSubject<boolean>(this.isAuthenticated);

  constructor(private http: HttpClient, private router: Router, private uiService: UIService) {}

  /**
   * Get token.
   */
  getToken(): string {
    return this.token;
  }

  /**
   * Get authenticathion status.
   */
  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  /**
   * Listen to changes in authentication status.
   */
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  /**
   * Create user.
   */
  signup(firstName: string, email: string, password: string, confirmPassword: string): Observable<UserResponseType> {
    return this.http.post<{ user: IUser }>(
      `${this.URL}/signup`,
      { firstName, email, password, confirmPassword },
      { observe: 'response' }
    );
  }

  /**
   * Log in user.
   */
  login(email: string, password: string): Observable<HttpResponse<{ token: string; expiresIn: number }>> {
    return this.http
      .post<{ token: string; expiresIn: number }>(`${this.URL}/login`, { email, password }, { observe: 'response' })
      .pipe(
        tap(response => {
          const token = response.body.token;
          if (token) {
            const expiresInDuration = response.body.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.token = token;
            this.isAuth(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
            this.saveAuthData(token, expirationDate);
            this.uiService.showSnackBar('Logged in successfully!', null, 3000, 'bottom');
            this.router.navigateByUrl('/board');
          }
        })
      );
  }

  /**
   * Initialize authentication.
   */
  initAuthentication() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuth(true);
      this.setAuthTimer(expiresIn / 1000);
    }
  }

  /**
   * Log out user.
   */
  logout() {
    this.token = null;
    this.isAuth(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.uiService.showSnackBar('Logged out successfully!', null, 3000, 'bottom');
    this.router.navigateByUrl('/');
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
  private getAuthData(): { token: string; expirationDate: Date } {
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

  private isAuth(val: boolean) {
    this.isAuthenticated = val;
    this.authStatusListener.next(val);
  }

  /**
   * Get email verification token.
   * @params token -> expires in 30 min from creation.
   */
  getEmailVerificationToken(token: string): Observable<{ token: { userId: string } }> {
    return this.http.get<{ token: { userId: string } }>(`${this.URL}/verify-email/${token}`);
  }

  /**
   * Resend verification token.
   */
  resendVerificationToken(email: string): Observable<{ token: object }> {
    return this.http.post<{ token: object }>(`${this.URL}/verify-email/token`, { email });
  }

  /**
   * Send reset password link.
   * @params email -> user's email.
   */
  forgotPassword(email: string): Observable<{ token: object }> {
    return this.http.post<{ token: object }>(`${this.URL}/reset-password`, { email });
  }
}
