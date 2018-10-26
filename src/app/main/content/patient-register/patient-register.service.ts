import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Patient } from './patient-register.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../users/contact.model';

@Injectable()
export class PatientRegisterService implements Resolve<any>
{

  onSelectedPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  private patientCollection: AngularFirestoreCollection<Patient>;

  patient: Patient[];
  user: any;
  selectedPatient: string[] = [];
  currentuser: Contact;

  searchText: string;
  filterBy: string;

  constructor(private readonly afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar) {

    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.patientCollection = afs.collection<Patient>('branch/' + this.currentuser.branchGUID + '/patients');
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {

    return new Promise((resolve, reject) => {
      Promise.all([this.getPatient()])
        .then(
          ([files]) => {
            this.onSearchTextChanged.subscribe(searchText => {
              console.log(searchText);
              this.searchText = searchText;
              this.getPatient();
            });

            resolve();

          },
          reject
        );
    });
  }

  getPatient(): Promise<any> {
    // return a firebase subscription
    return new Promise((resolve, reject) => {

      this.patientCollection.snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Patient;
          const guid = action.payload.doc.id;
          return { guid, ...data };
        });
      })

        .subscribe(res => {
          this.patient = res;

          if (this.searchText && this.searchText !== '') {
            this.patient = FuseUtils.filterArrayByString(this.patient, this.searchText);
          }

          this.onPatientChanged.next(this.patient);
          resolve(this.patient);
        }, reject);

    });
  }

  getUserData(): any {
    //return user data
  }

  toggleSelectedPatient(id) {
    if (this.selectedPatient.length > 0) {
      const index = this.selectedPatient.indexOf(id);

      if (index !== -1) {
        this.selectedPatient.splice(index, 1);

        // Trigger the next event
        this.onSelectedPatientChanged.next(this.selectedPatient);

        // Return
        return;
      }
    }

    // If we don't have it, push as selected
    this.selectedPatient.push(id);

    // Trigger the next event
    this.onSelectedPatientChanged.next(this.selectedPatient);
  }

  toggleSelectAll() {

  }

  selectPatient(filterParameter?, filterValue?) {
    this.selectedPatient = [];

    // If there is no filter, select all todos
    if (filterParameter === undefined || filterValue === undefined) {
      this.selectedPatient = [];
      this.patient.map(patient => {
        // this.selectedContacts.push(contact.id);
      });
    }
    else {
      /* this.selectedContacts.push(...
           this.contacts.filter(todo => {
               return todo[filterParameter] === filterValue;
           })
       );*/
    }

    // Trigger the next event
    this.onSelectedPatientChanged.next(this.selectedPatient);

  }

  updatePatient(guid, patient) {
    console.log(guid);
    console.log("updatePatient");
    return this.afs.doc<Patient>('branch/' + this.currentuser.branchGUID + '/patients/' + guid).set(patient);
  }

  newPatient(patient) {
    //register new patient
    return this.patientCollection.add(JSON.parse(JSON.stringify(patient)));

  }

  updateUserData(userData) {

  }

  deselectPatient() {
    this.selectedPatient = [];

    // Trigger the next event
    this.onSelectedPatientChanged.next(this.selectedPatient);

  }

  deletePatient(patient) {
    return this.afs.doc<Patient>('branch/' + this.currentuser.branchGUID + '/patients/' + patient.guid).delete();
  }

  deleteSelectedPatient() {

  }
}
