import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuboperatorListComponent } from './suboperator-list.component';

describe('SuboperatorListComponent', () => {
  let component: SuboperatorListComponent;
  let fixture: ComponentFixture<SuboperatorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuboperatorListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuboperatorListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
