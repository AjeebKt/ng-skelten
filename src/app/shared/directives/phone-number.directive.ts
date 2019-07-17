import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]'
})
export class PhoneNumberDirective {

  constructor() { }
  @HostListener('keydown', ['$event'])
  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9\+\(\)\-\  ]/;

    const inputChar = event.key;
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  @HostListener('contextmenu', ['$event'])
  onMouseClick(event: MouseEvent) {
    event.preventDefault();

  }
}
