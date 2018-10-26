import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../../users/contact.model';
import { reject } from 'q';
import { Timesheet } from '../timesheets.model';
import { TimesheetReport } from './timesheet-report.model'
import { TimesheetReportFormComponent } from './timesheet-report-form/timesheet-report-form.component'

@Injectable()
export class TimesheetService implements Resolve<any>{

  currentuser: Contact;
  timesheetId: string;
  
  timesheet: Timesheet;
  onTimesheetChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  timesheetReportList: TimesheetReport[];
  onTimesheetReportChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private readonly afs: AngularFirestore,
    private readonly tfs: AngularFirestore,
    private readonly rfs: AngularFirestore,
    public snackbar: MatSnackBar,
  ) { 
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    console.warn('ts id:', route.paramMap.get('id'));
    this.timesheetId = route.paramMap.get('id');

    return new Promise(( resolve, reject) => {
      Promise.all([
        this.getThisTimesheet(),
        this.getAllThisTimesheetReport()
      ])
      .then(
        ([files]) => {

        }
      )
    })
  }

  getThisTimesheet(): Promise<any> {
    return new Promise(( resolve, reject) => {
      this.afs.doc<Timesheet>('contacts/' + this.currentuser.uid + '/timesheets/' + this.timesheetId).valueChanges()
        .subscribe( res => {
          this.timesheet = res;
          console.log(this.timesheet);
          this.onTimesheetChanged.next( this.timesheet);
          resolve( this.timesheet)
        }, reject)
    })
  }

  getAllThisTimesheetReport(): Promise<any>{
    return new Promise(( resolve, reject) => {
      this.afs.collection<TimesheetReport>('contacts/' + this.currentuser.uid + '/timesheets/' + this.timesheetId + '/timesheet-reports')
      .snapshotChanges()
        .map(
          actions => {
            return actions.map( action => {
              const data = action.payload.doc.data() as TimesheetReport;
              data.guid = action.payload.doc.id;
              return data;
            })
          }
        )
        .subscribe( res => {
          this.timesheetReportList = res;
          this.onTimesheetReportChanged.next(this.timesheetReportList);
          resolve(this.timesheetReportList)
        }, reject)
    })
  }

  newTimesheetReport(report){
    if(!report){
      console.warn('Save timesheet failed');
      return
    }

    this.afs.collection<TimesheetReport>('contacts/' + this.currentuser.uid + '/timesheets/' + this.timesheetId)
      .add(report)
      .then( function() {
        console.warn('add report: true');
      })
      .catch( function(err){
        console.warn('add report error', err);
      })
  }

  updateTimesheetReport(report){
    if(!report){
      console.warn('update report failed');
      return 
    }

    this.afs.doc('contacts/' + this.currentuser + '/timesheets/' + this.timesheetId + '/timesheet-reports/' + report.guid)
      .update(report)
      .then( function() {
        console.warn('update report success')
      })
      .catch( function(err){
        console.warn('update report failed', err);
        
      })
  }

  deleteTimesheetReport(report){
    this.afs.doc('contacts/' + this.currentuser + '/timesheets/' + this.timesheetId + '/timesheet-reports/' + report.guid)
      .delete()
      .then(function () {
        console.warn('delete report success')
      })
      .catch(function (err) {
        console.warn('delete report failed', err);

      })
  }

}
