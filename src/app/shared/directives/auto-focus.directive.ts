import { Directive, AfterViewInit, ElementRef } from '@angular/core';
import { GlobalDataService } from 'src/app/core/services/global-data.service';

@Directive({
  selector: '[appAutofocus]'
})
export class AutoFocusDirective implements AfterViewInit {

  constructor(private el: ElementRef, private globalDataService: GlobalDataService) {
  }

  ngAfterViewInit() {
    this.globalDataService.focusChange.subscribe(() => {
      // console.log('focus', this.el.nativeElement);
      this.el.nativeElement.focus();

    })
    setTimeout(() => {
      this.el.nativeElement.focus();

    }, 400);
  }
}
