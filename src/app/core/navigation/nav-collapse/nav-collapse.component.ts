import { Component, OnInit, Input, HostBinding, ViewChild, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { NavigationService } from '../navigation.service';
import { MenuItem } from 'src/app/model/menu-item';
import { clAnimations } from '../../animation';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-nav-collapse',
  templateUrl: './nav-collapse.component.html',
  styleUrls: ['./nav-collapse.component.scss'],
  animations: clAnimations
})
export class NavCollapseComponent implements OnInit, AfterViewInit {

  @Input() menuItem: MenuItem;
  @HostBinding('class') classes = 'card';
  @ViewChild('button') buttonRef: ElementRef;
  public isOpen = false;

  constructor(
    private navigationService: NavigationService,
    private router: Router,
    private renderer: Renderer2
  ) {
    // Listen for route changes

    router.events.pipe(filter((routeEvent) => routeEvent instanceof NavigationEnd)).subscribe(
      (event: NavigationEnd) => {
        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.menuItem, event.urlAfterRedirects)) {
          this.expand();
        } else {
          this.collapse();
        }



      }
    );

    // Listen for collapsing of any navigation item
    this.navigationService.onNavCollapseToggled.subscribe(
      (clickedItem: MenuItem) => {
        if (clickedItem && clickedItem.submenu) {

          if (this.isChildrenOf(this.menuItem, clickedItem)) {
            return;
          }

          if (this.isUrlInChildren(this.menuItem, this.router.url)) {
            return;
          }

          // If the clicked item is not this item, collapse...
          if (this.menuItem !== clickedItem) {
            this.collapse();
          }
        }
      }
    );
  }

  ngOnInit() {

    // if (this.isUrlInChildren(this.menuItem, this.router.url)) {
    //   this.expand();
    // } else {
    //   this.collapse();
    // }
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.isUrlInChildren(this.menuItem, this.router.url)) {
        this.expand();
      } else {
        this.collapse();
      }
    }, 1000);

  }

  toggleOpen(ev) {
    // ev.preventDefault();
    try {
      if (this.menuItem) {
        this.menuItem.function();
      }
    } catch (e) {
    }
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.renderer.removeClass(this.buttonRef.nativeElement, 'collapsed');
      this.expand();
    } else {
      this.collapse();
    }

  }

  /**
   * Expand the collapsable navigation
   */
  expand() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this.navigationService.onNavCollapseToggle.emit();
  }

  collapse() {
    this.renderer.addClass(this.buttonRef.nativeElement, 'collapsed');
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.navigationService.onNavCollapseToggle.emit();
  }


  isChildrenOf(parent, item) {
    if (!parent.children) {
      return false;
    }

    if (parent.children.indexOf(item) !== -1) {
      return true;
    }

    for (const children of parent.children) {
      if (children.children) {
        return this.isChildrenOf(children, item);
      }
    }
  }


  isUrlInChildren(parent: MenuItem, url) {
    // console.log(parent, url);

    if (!parent.submenu) {
      return false;
    }

    for (let i = 0; i < parent.submenu.length; i++) {
      if (parent.submenu[i].submenu) {
        if (this.isUrlInChildren(parent.submenu[i], url)) {
          return true;
        }
      }

      if (parent.submenu[i].route === url || url.includes(parent.submenu[i].route)) {
        return true;
      }
    }

    return false;
  }

}
