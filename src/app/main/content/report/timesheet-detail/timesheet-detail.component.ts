import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { MatTableModule } from '@angular/material/table';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, Form } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog } from '@angular/material';
import { Subscribe } from '@firebase/util';
import { startWith } from 'rxjs/operator/startWith';
import { map } from 'rxjs/operators/map';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay
} from 'angular-calendar';
import { Subject } from 'rxjs/Subject';
import { CalendarService } from '../../calendar/calendar.service';
import { TemplateFirebaseService } from '../../template/templateFirebase.Service';
import { Template } from '../../template/template.model';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getYear } from 'date-fns';
import { ActivatedRoute } from '@angular/router';

import { TimesheetService } from './timesheet.service'
import { Timesheet } from '../timesheets.model';
import { TimesheetReport } from './timesheet-report.model'

@Component({
  selector: 'app-timesheet-detail',
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class TimesheetDetailComponent implements OnInit {

  timesheetId: string;
  timesheet:Timesheet;
  onTimesheetChanged:Subscription;

  // timesheetReportList: TimesheetReport[];
  // onTimesheetReportlistChanged:Subscription;
  
  constructor(
    private timesheetService: TimesheetService, 
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public calendarService: CalendarService,
    activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.onTimesheetChanged = 
      this.timesheetService.onTimesheetChanged
        .subscribe( timesheet => {
          console.warn('service:',timesheet)
          this.timesheet = timesheet;
        });
  }
  
}
