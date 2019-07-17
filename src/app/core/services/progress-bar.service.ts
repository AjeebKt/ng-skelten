import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {

  public status: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  display(value: boolean) {
    if (this.status.value !== value) {
      this.status.next(value);
    }

  }

  getStatus(): boolean {

    return this.status.value;

  }

}
