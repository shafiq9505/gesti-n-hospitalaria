import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { FusePatientPatientFormDialogComponent } from '../contact-form/contact-form.component';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort, MatTableModule, MatPaginatorModule } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { TimesheetNewFormComponent } from './timesheet-new-form/timesheet-new-form.component';
import { ReportService } from "./report.service";
import { Timesheet } from './timesheets.model'

import { Contact } from '../users/contact.model';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None
})
export class ReportComponent implements OnInit {

  currentUser:any;

  totalPatient: number;
  totalSelfHarm: number;

  patient:any;
  onPatientChangedSubscription: Subscription;

  dialogref: any;

  constructor(
    private reportService: ReportService,
    public dialog: MatDialog
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
  }

  ngOnInit() {
    this.onPatientChangedSubscription = 
      this.reportService.onPatientChanged
        .subscribe( patient => {
          this.patient = patient;
        });

    this.totalPatient = this.reportService.totalPatient;
    this.totalSelfHarm = this.reportService.selfHarmCounter;
  }


  newTimesheet() {
    this.dialogref = this.dialog.open(TimesheetNewFormComponent, {
      panelClass: 'new-timesheet-dialog',
      data: {
        action: 'new'
      }
    })

    this.dialogref.afterClosed()
      .subscribe((response: FormGroup) => {
        if (!response) {
          return;
        }
        this.reportService.saveTimesheet(response.getRawValue())
      });
  }

  deleteTimesheet(ts) {

  }


}
