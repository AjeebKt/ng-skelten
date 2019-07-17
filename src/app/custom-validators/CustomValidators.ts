import { AbstractControl, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static groupNameValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^(?:[A-Za-z]+)(?:[A-Za-z'0-9 _-]*)$/;
      const length = !!control.value ? control.value.length : 0;
      control.markAsTouched();
      if (!!control.value && length > 2) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { invalidGroupName: { message: 'Invalid group name' } };
      }
      return null;
    };
  }
  public static isFirstLetter(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const length = !!control.value ? control.value.length : 0;
      if (!!control.value && length > 0) {
        const tempCheck = control.value.substring(0, 1);
        let data;
        if (isNaN(tempCheck)) {
          data = true;
        } else {
          data = false;
        }
        if (tempCheck === '.') {
          data = false;
        } else {
          data = true;
        }
        return !!data
          ? null
          : { isValid: { message: 'First character must be letter' } };
      }
      return null;
    };
  }
  public static userIdValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^[a-zA-Z ]*\.?\-?[a-zA-Z ]*$/;
      const length = !!control.value ? control.value.length : 0;
      control.markAsTouched();
      if (!!control.value && length > 2) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { invalidName: { message: 'Invalid' } };
      }
      return null;
    };
  }
  public static nameValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^[a-zA-Z ]*\.?[a-zA-Z ]*$/;
      const length = !!control.value ? control.value.length : 0;
      control.markAsTouched();
      if (!!control.value && length > 2) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { invalidName: { message: 'Invalid' } };
      }
      return null;
    };
  }
  public static usernameValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^(?=.*[a-zA-Z])[A-Za-z\d ]\S+$/;
      const length = control.value.length;
      control.markAsTouched();
      if (!!control.value && length > 2) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { invalidName: { message: 'Invalid username' } };
      }
      return null;
    };
  }
  public static numberValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^([0-9]*[.])?[0-9]+/;
      control.markAsTouched();
      if (!!control.value) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { isValid: { message: 'Invalid input' } };
      }
      return null;
    };
  }
  public static passwordValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])[a-zA-Z0-9]{8,15}$/;
      const length = control.value.length;
      control.markAsTouched();
      control.markAsDirty();
      if (!!control.value) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { isValid: { message: 'Your password must contain 1 uppercase, 1 lowercase & 1 number' } };
      }
      return null;
    };
  }
  public static IpValidation(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.pristine) {
        return null;
      }
      const regex = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
      const length = control.value.length;
      control.markAsTouched();
      control.markAsDirty();
      if (!!control.value) {
        const data = regex.test(control.value);
        return !!data
          ? null
          : { isValid: { message: 'Invalid IP' } };
      }
      return null;
    };
  }
}
