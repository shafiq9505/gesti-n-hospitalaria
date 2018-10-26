import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetNewFormComponent } from './timesheet-new-form.component';

describe('TimesheetNewFormComponent', () => {
  let component: TimesheetNewFormComponent;
  let fixture: ComponentFixture<TimesheetNewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetNewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
