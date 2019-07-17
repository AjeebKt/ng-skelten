import { ValidatorFn, AbstractControl } from '@angular/forms';

export function NumberComparison(min: string): ValidatorFn {
    return (c: AbstractControl) => {
        if (c.root.get(min) && typeof c.value === 'number') {
            const secondValue = c.root.get(min).value;
            if (min === 'maxvalue') {
                if (secondValue !== null && secondValue !== '' && (secondValue <= c.value)) {
                    return { 'maxValue': { max: secondValue } };
                } else if (secondValue > c.value) {
                    c.root.get(min).setErrors(null);
                    return null;
                }
            } else if (min === 'minvalue') {
                if (c.value !== null && secondValue !== null && secondValue !== '' && (secondValue >= c.value)) {
                    c.root.get(min).setErrors(null);
                    return { 'minValue': { min: secondValue } };
                } else if (secondValue < c.value) {
                    if (typeof secondValue !== 'number') {
                        c.root.get(min).setErrors({ required: true });
                    } else {
                        c.root.get(min).setErrors(null);
                    }
                }
            }
        }
        return null;
    };
}
