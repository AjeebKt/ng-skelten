import {
  Component,
  OnInit,
  HostListener,
  ViewChild
} from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-frame-work-body',
  templateUrl: './frame-work-body.component.html',
  styleUrls: ['./frame-work-body.component.scss']
})
export class FrameWorkBodyComponent implements OnInit {
  sideNaveMode: any = 'side';
  sidenavStatus: boolean;
  @ViewChild('sidenav') sidenav: MatSidenavModule;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 800) {
      this.sideNaveMode = 'over';
      this.sidenavStatus = false;
    } else {
      this.sideNaveMode = 'side';
      this.sidenavStatus = true;
    }
  }

  constructor() { }

  ngOnInit() {
    this.sidenavStatus = true;
    if (window.innerWidth < 800) {
      this.sideNaveMode = 'over';
      this.sidenavStatus = false;
    } else {
      this.sideNaveMode = 'side';
      this.sidenavStatus = true;
    }

  }

}
