import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appSpaceRemover]'
})
export class SpaceRemoverDirective {
  @Input() spaceState = 'partial';
  constructor(private elementRef: ElementRef) {
    // console.clear();

  }
  @HostListener('keydown', ['$event'])
  keyPress(event: KeyboardEvent) {

    const node = this.elementRef.nativeElement, nodeLen = node.value.length,
      startPos = node.selectionStart, endPos = node.selectionEnd;
    if (event.ctrlKey && event.keyCode === 86) {
      event.preventDefault();
    }
    if (event.keyCode === 32) {
      event.preventDefault();
      if (this.spaceState === 'partial') {
        if (!!startPos) {
          const previousValue = node.value.substring(startPos - 1, startPos);
          if (previousValue !== ' ') {
            this.elementRef.nativeElement.value = node.value.substring(0, startPos) + ' ' + node.value.substring(endPos, nodeLen);
          }

        }
      }
    }
  }
  @HostListener('contextmenu', ['$event'])
  onMouseClick(event: MouseEvent) {
    event.preventDefault();

  }
  @HostListener('tap', ['$event'])
  onTap(evnt) {
    // alert('tap');
  }

}
