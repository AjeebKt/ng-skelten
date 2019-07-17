import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'input[type=floatNumber]'
})
export class FloatNumberDirective {

  constructor(private elementRef: ElementRef) { }
  @HostListener('keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    const pattern = /([0-9\.])/;
    const node = this.elementRef.nativeElement, nodeLen = node.value.length,
      startPos = node.selectionStart, endPos = node.selectionEnd, value: string = node.value;

    const inputChar = event.key;
    if (event.keyCode === 9) {
      return;
    }
    if (value.includes('.') && event.key === '.') {
      event.preventDefault();

    }
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  @HostListener('contextmenu', ['$event'])
  onMouseClick(event: MouseEvent) {
    event.preventDefault();

  }
}
