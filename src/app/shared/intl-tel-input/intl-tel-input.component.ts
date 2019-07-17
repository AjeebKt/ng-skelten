import {
  Component, OnInit, forwardRef, AfterViewInit,
  OnChanges, ViewChild, ElementRef, Output, EventEmitter, Input, Renderer2, Host, Optional
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, FormControl, NG_VALIDATORS, FormGroupDirective } from '@angular/forms';
import 'intl-tel-input';
declare let $: any;
declare let intlTelInput: any;
@Component({
  // tslint:disable-next-line:component-selector
  selector: 'intl-tel-input',
  templateUrl: './intl-tel-input.component.html',
  styleUrls: ['./intl-tel-input.component.scss'],
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => IntlTelInputComponent),
    multi: true
  },
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => IntlTelInputComponent),
    multi: true
  }
  ]
})
export class IntlTelInputComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator, OnChanges {


  // tslint:disable-next-line:indent
  value: string;
  valueSecond: string;
  status: boolean;
  statusSecond: boolean;
  initialCountryCode = 'SG';
  @Input() class = 'form-control';
  @ViewChild('phoneInput') inputElement: ElementRef;
  @Output() change: EventEmitter<any> = new EventEmitter();
  @Output() phNoTyped: EventEmitter<string> = new EventEmitter<string>();
  @Output() phNoTypedSecond: EventEmitter<string> = new EventEmitter<string>();
  @Input() currentContact: string;
  @Input() currentContactSecond: string;
  @Input() name: string;
  @Output() inputStatus: EventEmitter<any> = new EventEmitter();
  @Output() inputStatusSecond: EventEmitter<any> = new EventEmitter();
  ErrorMessage: string;
  iti: any;
  constructor(private elementRef: ElementRef, private renderer: Renderer2, @Optional() @Host() private formGroup: FormGroupDirective) {
  }
  onChange = (_f: any) => { };
  onTouched = () => { };
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  writeValue(obj: any): void {
    this.value = !!obj ? obj : '';
    if (!!this.value) {
      this.onChange(this.value);

      setTimeout(() => {

        this.iti = !!this.iti ? this.iti : this.intlTelInputInit();
        this.onValueChange(this.iti);
        const elem = this.inputElement.nativeElement;
        const evt = new KeyboardEvent('keyup', { bubbles: true });
        elem.dispatchEvent(evt);
      }, 50);

      this.phNoTyped.emit(this.value);
    }


  }

  setDisabledState?(isDisabled: boolean): void {

  }
  ngAfterViewInit() {
    // console.log(this.formGroup, 'formgroup');

    this.iti = !!this.iti ? this.iti : this.intlTelInputInit();

    this.renderer.listen(this.inputElement.nativeElement, 'keyup', (event) => {
      // this.onTouched();

      this.onValueChange(this.iti);

    });
    this.renderer.listen(this.inputElement.nativeElement, 'focus', (event) => {
      this.onValueChange(this.iti);

    });
    this.renderer.listen(this.inputElement.nativeElement, 'blur', (event) => {
      this.onTouched();
      this.value = this.iti.getNumber();
      this.status = this.iti.isValidNumber();
      this.change.emit(!!!this.value ? true : this.status);
    });
    // console.log(this.iti.getValidationError());

    this.inputStatus.emit(this.iti.isValidNumber());
    this.inputStatusSecond.emit(this.iti.isValidNumber());

  }
  ngOnInit() {
  }


  intlTelInputInit() {
    return intlTelInput(this.inputElement.nativeElement, {
      initialCountry: this.initialCountryCode,
      utilsScript: 'assets/js/utils.js?1537727621611'

    });

  }
  onValueChange(iti) {
    this.value = iti.getNumber();
    this.status = iti.isValidNumber();
    this.change.emit(this.status);
    // console.log(this.iti.getValidationError());

    this.onChange(this.value);
    this.initialCountryCode = this.iti.selectedCountryData.iso2;

    if (iti.isValidNumber()) {
      this.phNoTyped.emit(this.value);

      this.inputStatus.emit(true);
    } else {
      this.phNoTyped.emit(this.value);
      this.inputStatus.emit(false);
    }

  }


  ngOnChanges(): void {

    if (this.currentContact !== undefined) {
      this.value = this.currentContact;
      this.status = true;
    }
    if (this.currentContactSecond !== undefined) {
      this.valueSecond = this.currentContactSecond;
      this.statusSecond = true;
    }

  }
  public validate(c: FormControl): any {
    const iti = this.iti;

    // if (!iti || !c.value) {
    //   return { required: { message: 'Contact number is required' } };

    // } else
    // if (this.iti) {
    // //  const  errorMap = [ 'Invalid number', 'Invalid country code', 'Too short', 'Too long', 'Invalid number'];
    // //   console.log(this.iti.getValidationError());
    // }
    if (iti && !iti.isValidNumber() && c.value) {
      return { invalidContactNumber: true };
    }

    return null;
  }


}

