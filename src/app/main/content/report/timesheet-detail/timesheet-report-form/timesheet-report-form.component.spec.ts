import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetReportFormComponent } from './timesheet-report-form.component';

describe('TimesheetReportFormComponent', () => {
  let component: TimesheetReportFormComponent;
  let fixture: ComponentFixture<TimesheetReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
