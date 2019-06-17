import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UIService } from './ui.service';
import { Injectable } from '@angular/core';

/**
 * Error interceptor.
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private uiService: UIService) {}

  /**
   * Intercept server errors.
   */
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = `Server is not responding at the moment. Please try again later.
           We are sorry for any inconvinience.`;
        if (error.error.message) {
          errorMessage = error.error.message;
        }
        this.uiService.showSnackBar(errorMessage, null, 5000, 'top');
        return throwError(error);
      })
    );
  }
}
