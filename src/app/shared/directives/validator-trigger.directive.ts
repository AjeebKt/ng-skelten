import { Directive, HostListener, ElementRef, OnInit, Host, Attribute, Optional } from '@angular/core';
import { NgControl, FormControlName, FormGroupDirective, DefaultValueAccessor } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { OnEnterService } from 'src/app/core/services/on-enter.service';
import { FocusOnErrorDirective } from './focus-on-error.directive';
import { SelectComponent } from 'ng2-select';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';
import { NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import * as _ from 'underscore';
import { IntlTelInputComponent } from '../intl-tel-input/intl-tel-input.component';

@Directive({
  selector: '[appValidatorTrigger]'
})
export class ValidatorTriggerDirective implements OnInit {

  private isBlur = new Subject();
  private validators: any;
  private asyncValidators: any;
  private wasChanged: any;
  touched = 1;
  constructor(public formControl: NgControl, private onEnterService: OnEnterService,
    @Optional() ngMultiSelect: MultiSelectComponent,
    @Optional() ngMydatePicker: NgxMyDatePickerDirective,
    @Attribute('formControlName') private formControlName: string,
    private elementRef: ElementRef, @Host() private focusOnError: FocusOnErrorDirective,
    @Host() private formGroup: FormGroupDirective) {

    if (ngMultiSelect) {
      const multiselect = ngMultiSelect as any;
      multiselect.isTouched = false;
      ngMultiSelect.onSelect.subscribe((selectedData) => {
        multiselect.isTouched = true;

      });
      ngMultiSelect.onSelectAll.subscribe((selectedData) => {
        multiselect.isTouched = true;

      });
      ngMultiSelect.onDeSelect.subscribe((selectedData) => {
        multiselect.isTouched = true;

      });

      ngMultiSelect.onDeSelectAll.subscribe((selectedData) => {
        multiselect.isTouched = true;

      });
      ngMultiSelect.onDropDownClose.subscribe((selectedData) => {
        if (multiselect.isTouched) {
          this.formControl.control.markAsDirty();
          this.formControl.control.markAsTouched();
        }
      });

    }

  }
  ngOnInit() {
    this.isBlur.pipe(debounceTime(150)).subscribe(() => {
      this.formControl.control.setAsyncValidators(this.asyncValidators);
      this.formControl.control.setValidators(this.validators);
      if (this.wasChanged) {
        this.formControl.control.updateValueAndValidity();

      }
      if (this.formControl.invalid) {
        this.touched++;
      }
    });
  }
  @HostListener('focus', ['$event'])
  onFocus(event) {
    this.wasChanged = false;
    this.validators = this.formControl.control.validator;
    this.asyncValidators = this.formControl.control.asyncValidator;

    if ((this.formControl.invalid && this.touched > 1) || this.touched > 1) {
      this.formControl.control.setAsyncValidators(this.asyncValidators);
      this.formControl.control.setValidators(this.validators);
    } else {
      this.formControl.control.clearAsyncValidators();
      this.formControl.control.clearValidators();
    }
    this.touched++;
  }
  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    if (!event.shiftKey && event.keyCode === 13) {
      this.elementRef.nativeElement.blur();
      this.elementRef.nativeElement.blur();
    }
    this.wasChanged = true; // keyboard change
    if (this.formControl.touched) {
    }
    if (event.keyCode === 13) {
      this.focusOnError.onEnterKey.next(event);
    }
  }
  @HostListener('change', ['$event'])
  onChange(event) {
    this.wasChanged = true; // copypaste change
  }
  @HostListener('ngModelChange', ['$event'])
  onNgModelChange(event) {
    this.wasChanged = true; // ng-value change
  }
  @HostListener('blur', ['$event'])
  onBlur(event) {
    this.isBlur.next();
  }
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {

    if (event.keyCode === 9) {
      const formControls: FormControlName[] = this.formGroup.directives;
      const currentIndex = _.findIndex(formControls, (f: FormControlName) => f.name === this.formControlName);
      let nextFormControl: FormControlName = formControls[currentIndex + 1];
      const currentControl: FormControlName = formControls[currentIndex];
      if (this.formControlName === 'SelectedChoice') {
        nextFormControl = formControls[currentIndex + 2];
      }

      if (!!nextFormControl) {
        event.preventDefault();
        const nextComponent: any = nextFormControl.valueAccessor;
        const currentComponent: any = currentControl.valueAccessor;
        if (nextComponent instanceof SelectComponent) {
          const spanEl = nextComponent.element.nativeElement.querySelector('.ui-select-toggle') || nextComponent.element.nativeElement.querySelector('.ui-select-search');
          const evt = new MouseEvent('click', { bubbles: true });
          spanEl && spanEl.dispatchEvent(evt);
        } else if (nextComponent instanceof MultiSelectComponent) {
          const component: any = nextComponent;
          const spanEl = component.cdr.rootNodes[0].querySelector('.dropdown-btn');
          const evt = new MouseEvent('click', { bubbles: true });
          if (currentComponent instanceof NgxMyDatePickerDirective) {
            currentComponent.closeCalendar();
            const currComponent: any = currentComponent;
            currComponent.elem.nativeElement.blur();

          }
          spanEl && spanEl.focus();
          spanEl && spanEl.dispatchEvent(evt);
          // nextComponent.toggleDropdown(evt);
        } else if (nextComponent instanceof DefaultValueAccessor) {

          const defaultValueAccessor: any = nextComponent;
          if (currentComponent instanceof SelectComponent) {
            currentComponent.clickedOutside();
            defaultValueAccessor._elementRef.nativeElement.focus();

          } else if (currentComponent instanceof MultiSelectComponent) {
            currentComponent.closeDropdown();
            defaultValueAccessor._elementRef.nativeElement.focus();
          } else {
            defaultValueAccessor._elementRef.nativeElement.focus();

          }


        } else if (nextComponent instanceof NgxMyDatePickerDirective) {

          const component: any = nextComponent;
          component.toggleCalendar();
        } else if (nextComponent instanceof IntlTelInputComponent) {
          nextComponent.inputElement.nativeElement.focus();

        }
      }
    }
  }
}
