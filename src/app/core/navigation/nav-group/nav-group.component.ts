import { Component, OnInit, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-nav-group',
  templateUrl: './nav-group.component.html',
  styleUrls: ['./nav-group.component.scss']
})
export class NavGroupComponent implements OnInit {

  @HostBinding('class') classes = 'nav-group nav-item';
  @Input() item: any;

  constructor() {
  }

  ngOnInit() {
  }

}
