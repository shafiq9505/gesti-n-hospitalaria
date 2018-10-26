import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { reject } from 'q';

export interface HighAlertModel{ guid:any, actedUser:any, action: any, date:any, time:any}
@Injectable()
export class PatientLogServiceService {

  currentuser:any;
  patient:any;

  constructor(
    private readonly afs: AngularFirestore,
    public snackbar:MatSnackBar
  ) { 
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
    return new Promise((resolve, reject) => {
      Promise.all([

      ]).then(
        ([files]) => {
          resolve();
        }
      )
    })
  }

  getPatientLog() {
    return new Promise((reoslve, reject) => {
      this.afs.collection('branch/'+ this.currentuser.branchGUID+'/patient/'+ this.patient.guid+'/patient-log')
        .snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as HighAlertModel;
          data.guid = action.payload.doc.id;
          return data;
        })
      })
    })
  }

  patientFromComponent(patient){
    this.patient = patient;
  }

}
