import {
    NG_VALIDATORS,
    Validator,
    AbstractControl
} from '@angular/forms';
import { Directive, forwardRef, Attribute, Input } from '@angular/core';
@Directive({
    // tslint:disable-next-line:directive-selector
    selector: '[emailValidator][formControlName],[emailValidator][formControl],[emailValidator][ngModel]',
    providers: [
        {
            provide: NG_VALIDATORS,
            useExisting: forwardRef(() => EmailValidatorDirective),
            multi: true
        }
    ]
})
export class EmailValidatorDirective implements Validator {

    constructor() { }


    validate(c: AbstractControl): { [key: string]: any; } {
        // tslint:disable-next-line:max-line-length
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (c.value) {
            return EMAIL_REGEXP.test(c.value) ? null : {

                email: { message: 'Email is required and format should be john@doe.com.' }

            };
        }
        return null;

    }

}
