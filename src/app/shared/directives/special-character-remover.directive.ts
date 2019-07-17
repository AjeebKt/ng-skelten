import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSplCharRemover]',
})
export class SpecialCharacterRemoverDirective {
  @Input() notAllowState = 'allow';
  constructor(private elementRef: ElementRef) {
    // console.clear();
  }
  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent) {

    const key = event.keyCode;
    const validKeys = [190, 222];
    const invalidKeys = [];

    for (let i = 106; i < 112; i++) { // + - * /
      if (i !== 110) {
        invalidKeys.push(i);
      }
    }
    for (let i = 186; i < 222; i++) { // ; ": " ><
      if (i !== 190) {
        invalidKeys.push(i);
      }
    }

    if (event.ctrlKey && event.keyCode === 86) {
      event.preventDefault();
    }
    if ((event.shiftKey && invalidKeys.concat(validKeys).indexOf(key) > -1)) {
      event.preventDefault();
    }
    if (this.notAllowState === 'number') {
      for (let i = 96; i < 106; i++) {
        invalidKeys.push(i);
      }
      for (let i = 48; i < 58; i++) { // numbers
        invalidKeys.push(i);
      }

    } else if (this.notAllowState === 'special') {
      for (let i = 48; i < 58; i++) { // numbers
        validKeys.push(i);
      }
    } else if (this.notAllowState === 'special-full') {
      for (let i = 48; i < 58; i++) { // numbers
        invalidKeys.push(i);
      }
      invalidKeys.push(190);
      invalidKeys.push(222);
      invalidKeys.push(110);
    }
    if (invalidKeys.indexOf(key) > -1 || (event.shiftKey && invalidKeys.concat(validKeys).indexOf(key) > -1)) {
      event.preventDefault();
    }

  }
  @HostListener('contextmenu', ['$event'])
  onMouseClick(event: MouseEvent) {
    event.preventDefault();

  }
}
