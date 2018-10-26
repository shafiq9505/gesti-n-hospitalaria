import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/Observable';
// import { FusePatientPatientFormDialogComponent } from '../contact-form/contact-form.component';
import { MatDialog, MatDialogRef, MatPaginator, MatTableDataSource, MatSort, MatTableModule, MatPaginatorModule  } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { TimesheetNewFormComponent } from '../timesheet-new-form/timesheet-new-form.component';
import { ReportService } from "../report.service";
import { Timesheet } from '../timesheets.model'

@Component({
  selector: 'app-timesheet-list',
  templateUrl: './timesheet-list.component.html',
  styleUrls: ['./timesheet-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimesheetListComponent implements OnInit {

  timesheets: Timesheet;
  totalTimesheet: any;
  user:any;

  dataSource = new MatTableDataSource();
  displayedColumns = ['from','to','totalHours'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  onTimesheetChangedSubscription: Subscription;

  dialogref: any;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private reportService: ReportService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { 
    this.onTimesheetChangedSubscription = 
      this.reportService.onTimesheetsChanged
      .subscribe( ts => {
        this.timesheets = ts;
        console.warn('timesheet',this.timesheets);
        this.totalTimesheet = ts.lenght;
      })
   }

  ngOnInit() {

    this.reportService.onTimesheetsChanged.subscribe( ts => {
      this.dataSource.data = ts;
    });

    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.onTimesheetChangedSubscription.unsubscribe();
  }

}
