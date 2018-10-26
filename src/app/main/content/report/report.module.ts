import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { ReportComponent } from './report.component';
import { ReportService } from './report.service';
import { TimesheetListComponent } from './timesheet-list/timesheet-list.component';
import { TimesheetDetailComponent } from './timesheet-detail/timesheet-detail.component';
import { TimesheetReportListComponent } from './timesheet-detail/timesheet-report-list/timesheet-report-list.component';
import { TimesheetReportFormComponent } from './timesheet-detail/timesheet-report-form/timesheet-report-form.component';
import { TimesheetService } from './timesheet-detail/timesheet.service';
import { TimesheetNewFormComponent } from './timesheet-new-form/timesheet-new-form.component';
const routes = [
  {
    path: 'reports',
    component: ReportComponent,
    resolve: {
      report: ReportService
    }
  },{
    path: 'reports/:id',
    component: TimesheetDetailComponent,
    children: [
      {
        path: 'timesheets',
        component: TimesheetReportListComponent,
        reslve: {
          timesheet: TimesheetService
        },
      },
    ]
  }
]

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ReportComponent,
    TimesheetListComponent,
    TimesheetDetailComponent,
    TimesheetReportListComponent,
    TimesheetReportFormComponent,
    TimesheetNewFormComponent
  ],
  exports: [
    ReportComponent
  ],
  providers: [
    ReportService,
    TimesheetService
  ],
  entryComponents: [
    TimesheetNewFormComponent
  ]
})
export class ReportModule { }
