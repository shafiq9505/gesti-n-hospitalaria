import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimesheetReportListComponent } from './timesheet-report-list.component';

describe('TimesheetReportListComponent', () => {
  let component: TimesheetReportListComponent;
  let fixture: ComponentFixture<TimesheetReportListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimesheetReportListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
