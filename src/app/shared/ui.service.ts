import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * User interface service
 */
@Injectable({
  providedIn: 'root'
})
export class UIService {
  loadingStateChanged = new BehaviorSubject<boolean>(true);

  constructor() {}
}
