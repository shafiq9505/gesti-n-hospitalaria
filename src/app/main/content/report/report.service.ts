import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../users/contact.model';
import { Timesheet } from './timesheets.model';
import { reject } from 'q';

@Injectable()
export class ReportService {

  currentUser:Contact;
  totalPatient: number = 0;
  selfHarmCounter: number = 0;
  

  patient:any[];
  onPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  timesheets:Timesheet[];
  onTimesheetsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  selectedTimesheet: any;

  constructor( 
    private http: HttpClient,
    private afs: AngularFirestore
  ) { 
    this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | any{

    return new Promise((resolve,reject) => {

      Promise.all([
        this.getPatient(),
        this.getTimesheet()
      ]).then(
        ([ files ]) => {
          resolve();
        },
        reject
      );
    });
  
  }

  getCurrentUser(){
    
  }

  getPatient(): Promise<any>{
    return new Promise((resolve, reject) => {

      this.afs.collection('branch/'+ this.currentUser.branchGUID +'/patients').snapshotChanges()
        .map(actions => {
          return actions.map( action => {
            const data = action.payload.doc.data() as any;
            data.guid = action.payload.doc.id;
          
            if(data.selfharm_status === 'true'){
              this.selfHarmCounter++;
            }
            return data;
        });
      })
      .subscribe( res => {
        this.patient = res;
        this.totalPatient = this.patient.length;
        this.onPatientChanged.next( this.patient);
        resolve(this.patient);        
      }, reject);
    })
  }

  getTimesheet(): Promise<any>{
    return new Promise(( resolve ,reject) => {
      this.afs.collection('/contacts/' + this.currentUser.uid + '/timesheets').snapshotChanges()
        .map(actions => {
          return actions.map( action => {
            const data = action.payload.doc.data() as Timesheet;
            data.uid = this.currentUser.uid;
            data.branchguid = this.currentUser.branchGUID;
            data.guid = action.payload.doc.id;
            return data;
          })
        }).subscribe( res => {
          this.timesheets = res;
          this.onTimesheetsChanged.next( this.timesheets );
          resolve( this.timesheets )
        }, reject);
    })
  }

  saveTimesheet(timesheet){
    console.warn('report timesheet:', timesheet);
    this.afs.collection('contacts/'+ this.currentUser.uid + '/timesheets')
      .add(timesheet)
      .then( function() {
        console.warn('add new timesheet:true');
      })
      .catch( function( err ){
        console.warn('add timesheet error:false, error:',err);
      })
  }

  filterTimesheet(){
    let temp = this.timesheets.filter( ts => {
      if( ts.guid === this.selectedTimesheet ){
        return ts;
      }
    });
    return temp;
  }
  
}