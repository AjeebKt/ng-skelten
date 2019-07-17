import { Component, OnInit, Input } from '@angular/core';
import { AbstractControlDirective, AbstractControl } from '@angular/forms';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'show-errors',
  template: `
  <mat-error style="font-size:12px"[innerHTML]='listOfErrors()'></mat-error>
  `,
})
export class ShowErrorsComponent {
  @Input() tag = 'enter';
  private readonly errorMessages = {
    'required': () => `Please ${this.tag} ${this.transform(this.field)} `,
    'minlength': (params) => `${this.transform(this.field)} must be atleast ${params.requiredLength} characters long `,
    'maxlength': (params) => ` ${this.transform(this.field)} cannot be more than  ${params.requiredLength} characters long `,
    'pattern': (params) => `${this.transform(this.getRequiredPattern(params))} `,
    'notAllowed': () => `Females between the age 10 and 50 are not allowed to book the room`,
    'notSame': () => `${this.transform(this.field)} is mismatch`,
    'isBefore': (params) => !!params.message ? params.message : `${this.transform(this.field)} must be greater than From Date`,
    'invalidInvoice': () => `Invalid ${this.transform(this.field)} `,
    'isValid': (params) => params.message,
    'isExist': (params) => params.message,
    'deletedUser': (params) => params.message,
    'matchPassword': () => `New password cannot be the same as the Current password`,
    'incorrectPass': () => `Incorrect current password`,
    'inactiveUser': (params) => params.message,
    'invalidCreds': (params) => params.message,
    'invalidGroupName': (params) => `Invalid ${this.transform(this.field)}`,
    'ng2SelectEmptyError': () => `Please choose a ${this.transform(this.field)} `,
    'invalidName': (params) => `Invalid ${this.transform(this.field)}`,
    'invalidContactNumber': () => `Please enter a valid ${this.transform(this.field)} `,
    'email': () => `Please enter  ${this.transform(this.field)} in format: name@email.com/.net/.in`,
    'min': (params) => `${this.transform(this.field)} must be ${params.min} or above ${params.min} `,
    'max': (params) => `${this.transform(this.field)} must be ${params.max} or below ${params.max} `,
    'minValue': (params) => `${this.transform(this.field)} must be  above ${params.min} `,
    'maxValue': (params) => `${this.transform(this.field)} must be below ${params.max} `,
    'rangeLength': (params) => `${this.transform(this.field)} should be ${params.minlength}-${params.maxlength} characters `,
    'invalidDateFormat': (params) => `Invalid Date Format`,
    'invalidEmail': (params) => `Please enter  ${this.transform(this.field)} in format: name@email.com/.net/.in`,
  };
  @Input()
  public control: AbstractControlDirective | AbstractControl;
  @Input()
  public field: string;
  @Input() isDisplayError = false;

  listOfErrors() {
    let error;
    if (this.control.errors) {
      Object.keys(this.control.errors)
        .map(field => error = this.getMessage(field, this.control.errors[field]));
    }
    return error;
  }
  transform(value: string, letterCase = 'u'): any {
    if (letterCase === 'u') {
      return value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      return value.charAt(0).toLowerCase() + value.slice(1);

    }
  }
  private getMessage(type: string, params: any) {
    return this.control.touched && this.control.dirty ? this.errorMessages[type](params) : '';
  }
  private getRequiredPattern(params) {
    if (params.requiredPattern === '^^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$$') {
      return `Enter a valid ${this.field}  <span class="widget-login-info">(eg:example@example.com)</span>`;
    }
    return `${this.field} not valid`;
  }
  constructor() {

  }

}
