import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSuboperatorComponent } from './add-edit-suboperator.component';

describe('AddEditSuboperatorComponent', () => {
  let component: AddEditSuboperatorComponent;
  let fixture: ComponentFixture<AddEditSuboperatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSuboperatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSuboperatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
