import { ValidatorFn, AbstractControl } from '@angular/forms';

export function rangeLength(min: number, max: number): ValidatorFn {
    return (c: AbstractControl) => {
        if (c.value && ( c.value.length > max)) {
            return { 'rangeLength': { minlength: min, maxlength: max } };
        }
        return null;
    };
}
