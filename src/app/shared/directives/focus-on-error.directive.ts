import { Directive, AfterViewInit } from '@angular/core';
import { FormGroupDirective, FormControlName, DefaultValueAccessor } from '@angular/forms';
import * as _ from 'underscore';
import { SelectComponent } from 'ng2-select';
import { NgxMyDatePickerDirective } from 'ngx-mydatepicker';
import { Subject } from 'rxjs';
import { MultiSelectComponent } from 'ng-multiselect-dropdown';

@Directive({
  selector: '[appFocusOnError]',
  exportAs: 'appFocusOnError'
})
export class FocusOnErrorDirective implements AfterViewInit {

  onEnterKey = new Subject<KeyboardEvent>();
  constructor(private formGroupDirective: FormGroupDirective) { }
  ngAfterViewInit() {
  }
  focusOnFirstElement() {
    const formControls: FormControlName[] = this.formGroupDirective.directives;
    const formControlsLength = formControls.length;
    // console.log(this.formGroupDirective);
    for (let i = 0; i < formControlsLength; i++) {
      const currentComponent: any = formControls[i].valueAccessor;
      if (formControls[i].invalid && formControls[i].touched && formControls[i].dirty) {
        if (currentComponent instanceof SelectComponent) {
          const spanEl = currentComponent.element.nativeElement.querySelector('.ui-select-toggle');
          const evt = new MouseEvent('click', { bubbles: true });
          spanEl && spanEl.dispatchEvent(evt);
        } else if (currentComponent instanceof MultiSelectComponent) {
          const component: any = currentComponent;
          const spanEl = component.cdr.rootNodes[0].querySelector('.dropdown-btn');
          const evt = new MouseEvent('click', { bubbles: true });
          spanEl.dispatchEvent(evt);
          // nextComponent.toggleDropdown(evt);
        } else if (currentComponent instanceof DefaultValueAccessor) {
          const errorComponent: any = currentComponent;
          errorComponent._elementRef.nativeElement.focus();
        } else if (currentComponent instanceof NgxMyDatePickerDirective) {
          const errorComponent: any = currentComponent;
          currentComponent.openCalendar();
          errorComponent.elem.nativeElement.focus();

        }
        break;
      }
    }
  }


}
