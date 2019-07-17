import { Directive, Output, EventEmitter, HostListener, Input, OnChanges, SimpleChanges, AfterViewInit, Renderer2 } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OnEnterService } from 'src/app/core/services/on-enter.service';
import { FocusOnErrorDirective } from './focus-on-error.directive';

@Directive({
  selector: '[appButtonSubmit]',
})
export class ButtonSubmitDirective implements AfterViewInit {
  @Output() submission = new EventEmitter<any>();
  private events = new Subject();
  // tslint:disable-next-line:no-input-rename
  @Input('form') focusOnErrorDir: FocusOnErrorDirective;
  constructor(private onEnterService: OnEnterService, private renderer: Renderer2) {
    this.events.pipe(debounceTime(500)).subscribe(() => {
      this.submission.emit();
      this.focusOnErrorDir.focusOnFirstElement();
    });


  }
  ngAfterViewInit() {
    this.focusOnErrorDir.onEnterKey.subscribe((event: KeyboardEvent) => {
      this.onKeyUp(event);
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    this.markAsDirty();

  }
  hasClassForActiveElement(cssClass: string) {
    return document.activeElement.classList.contains(cssClass);
  }
  onKeyUp(event: KeyboardEvent) {

    if (!event.shiftKey && event.keyCode === 13) {
      const multiselect = !this.hasClassForActiveElement('multiselect-select-all');
      const multiselect1 = !this.hasClassForActiveElement('dropdown-btn');
      const multiselect2 = !this.renderer.parentNode(document.activeElement).classList.contains('filter-textbox');
      const isMultiselectComponent = multiselect && multiselect1 && multiselect2;
      // this.isIntlTelInput();
      // country-list dropup
      if (isMultiselectComponent && !this.hasClassForActiveElement('ui-select-container') && !this.hasClassForActiveElement('mat-button')) {
        this.markAsDirty();
      }
    }
  }
  isIntlTelInput() {
    const parentNode = this.renderer.parentNode(document.activeElement);
    const intelTelInput = !this.hasClassForActiveElement('selected-flag');
    let flag = intelTelInput;

    if (parentNode.querySelector('.country-list') && flag) {
      flag = parentNode.querySelector('.country-list').classList.contains('hide');
    }
    const element = document.activeElement as any;

    return flag && typeof element.selectionStart === 'number';
  }
  private markAsDirty() {
    let formGroup;
    if (this.focusOnErrorDir instanceof FocusOnErrorDirective) {
      const focusOnError: any = this.focusOnErrorDir;
      formGroup = focusOnError.formGroupDirective;
    }
    if (formGroup) {
      const controls = formGroup.control.controls;
      Object.keys(controls).forEach((key) => {
        if (controls[key] instanceof FormArray) {
          const formArray = controls[key] as FormArray;
          for (let i = 0; i < formArray.length; i++) {
            const formGroupFromArray = formArray.controls[i] as FormGroup;
            Object.keys(formGroupFromArray.controls).forEach((fkey) => {

              formGroupFromArray.controls[fkey].markAsDirty();
              formGroupFromArray.controls[fkey].markAsTouched();
            });

          }
        }
        controls[key].markAsTouched();
        controls[key].markAsDirty();
      });
    }
    this.events.next();
  }
}
