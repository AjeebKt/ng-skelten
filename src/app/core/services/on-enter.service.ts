import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroupDirective } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class OnEnterService {
  onEnterSubject = new Subject<KeyboardEvent>();
  // formGroup: FormGroupDirective;
  constructor() { }

}
