import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MatSnackBar, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

/**
 * User interface service
 */
@Injectable({
  providedIn: 'root'
})
export class UIService {
  loadingStateChanged = new BehaviorSubject<boolean>(true);

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Display a snack bar to inform user about a change or error
   */
  showSnackBar(message: string, action: any, duration: number, position: MatSnackBarVerticalPosition) {
    this.snackBar.open(message, action, {
      duration,
      verticalPosition: position
    });
  }
}
