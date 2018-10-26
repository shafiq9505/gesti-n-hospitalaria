import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Timesheet } from '../timesheets.model';
import { BranchService } from '../../branchmgt/branch.service';
import { Subscription } from 'rxjs/Subscription';
import { ReportService } from '../report.service'

@Component({
  selector: 'app-timesheet-new-form',
  templateUrl: './timesheet-new-form.component.html',
  styleUrls: ['./timesheet-new-form.component.scss']
})
export class TimesheetNewFormComponent implements OnInit {

  action:string;
  event: CalendarEvent;
  dialogTitle: string;
  timesheet: Timesheet;
  timesheetForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<TimesheetNewFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private bfs: BranchService,
    private reportService: ReportService,
  ) {
      this.action = data.action;

      if( this.action === 'new' ) {
        this.dialogTitle = 'New Timesheet'
        this.timesheet = new Timesheet({});
      } else {
        this.dialogTitle = 'Edit Timesheet'
        this.timesheet = data.timesheet;
      }

      this.timesheetForm = this.createTimesheetForm();
   }

  ngOnInit() {
  }

  createTimesheetForm()
  {
     return this.formBuilder.group( {
       id: [this.timesheet.id],
       guid : [this.timesheet.guid],
       uid: [this.timesheet.uid],
       branchguid: [this.timesheet.branchguid],
       from: [this.timesheet.from],
       to: [this.timesheet.to],
       totalHours: [this.timesheet.totalHours]
     })
  }

}
