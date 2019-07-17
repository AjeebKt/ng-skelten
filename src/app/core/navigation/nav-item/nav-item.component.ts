import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { MenuItem } from 'src/app/model/menu-item';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {

  @HostBinding('class') classes = 'card-body';
  @Input() item: MenuItem;

  constructor() {
  }

  ngOnInit() {
  }

}
