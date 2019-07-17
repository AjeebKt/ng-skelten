import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDateInputDisable]'
})
export class DateInputDisableDirective {

  constructor() { }
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    event.preventDefault();
  }
  @HostListener('keyup', ['$event'])
  onKeyup(event: KeyboardEvent) {
    event.preventDefault();
  }
  @HostListener('contextmenu', ['$event'])
  onMouseClick(event: MouseEvent) {
    event.preventDefault();

  }
}
