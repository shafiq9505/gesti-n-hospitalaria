import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Patient } from './patient.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Contact } from '../users/contact.model';

export interface Patient { fname: string; lname: string }


@Injectable()
export class PatientService implements Resolve<any>
{
    onPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onMedicationChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onSelectedPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();
    private patientCollection: AngularFirestoreCollection<Patient>;

    patient: Patient[];
    user: any;
    selectedPatient: string[] = [];
    currentuser: Contact;

    totalPatients: number;
    totalHighAlertPatients: number;
    totalUnassignedPatients: number;
    totalSelfHarmPatients: number;
    // totalClosurePatients: number;
    totalMyPatients: number;

    searchText: string;
    filterBy: string;
    constructor(private readonly afs: AngularFirestore,
        public snackbar: MatSnackBar) {
        this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
        this.patientCollection = afs.collection<Patient>('branch/' + this.currentuser.branchGUID + '/patients');
        //this.patientCollection = afs.collection<Patient>('patient');
        this.filterBy = "all";
    }

    /**
     * The Patient App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getPatient(),
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getPatient();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
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

                    //Calculate all the patients stats according to category
                    this.totalPatients = this.patient.length;

                    let mypatients = new Array<Patient>();
                    let unassigned_patients = new Array<Patient>();
                    let selfharm_patients = new Array<Patient>();
                    let highalert_patients = new Array<Patient>();
                    let userid = this.currentuser.guid;

                    this.patient.forEach(function (p) {

                        if (p.doctorid == userid) {
                            mypatients.push(p);
                        }

                        if (p.current_assigned_doctor == '') {
                            unassigned_patients.push(p);
                        }

                        if (p.selfharm_status) {
                            selfharm_patients.push(p);
                        }

                        if (p.highalert == 'true') {
                            highalert_patients.push(p);
                        }

                    });

                    this.totalMyPatients = mypatients.length;
                    this.totalUnassignedPatients = unassigned_patients.length;
                    this.totalSelfHarmPatients = selfharm_patients.length;
                    this.totalHighAlertPatients = highalert_patients.length;

                    if (this.filterBy === 'mypatient') {

                        this.patient = mypatients;
                    }

                    if (this.filterBy === 'unassigned') {

                        this.patient = unassigned_patients;
                    }

                    if (this.filterBy === 'selfharm') {

                        this.patient = selfharm_patients;
                    }

                    if (this.filterBy === 'starred') {

                        this.patient = highalert_patients;
                    }

                    // if (this.filterBy === 'closure') {
                    //     let closure_patients = new Array<Patient>();
                    //     this.patient.forEach(function (p) {
                    //         if (p.closure_status) {
                    //             closure_patients.push(p);
                    //         }
                    //     });
                    //     this.patient = closure_patients;
                    //     this.totalClosurePatients = this.patient.length;
                    // }

                    if (this.searchText && this.searchText !== '') {
                        this.patient = FuseUtils.filterArrayByString(this.patient, this.searchText);
                    }

                    this.onPatientChanged.next(this.patient);
                    resolve(this.patient);
                }, reject);

        });
    }

    getUserData(): any {
    }

    /**
     * Toggle selected patient by id
     * @param id
     */
    toggleSelectedPatient(id) {
        // First, check if we already have that todo as selected...
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

    /**
     * Toggle select all
     */
    toggleSelectAll() {
        if (this.selectedPatient.length > 0) {
            this.deselectPatient();
        }
        else {
            // this.selectPatient();
        }
    }

    selectPatient(filterParameter?, filterValue?) {
        this.selectedPatient = [];

        // If there is no filter, select all todos
        if (filterParameter === undefined || filterValue === undefined) {
            this.selectedPatient = [];
            this.patient.map(patient => {
                this.selectedPatient.push(patient.id);
            });
        }
        else {
            /* this.selectedPatient.push(...
                 this.patient.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedPatientChanged.next(this.selectedPatient);
    }

    updatePatient(patient,actedUser) {
        console.log('PATIENTS',patient.guid);
        let action = "";
        let currentAlert = (patient.highalert ? patient.highalert : 'false');
        let date = new Date().toLocaleDateString();
        let time = new Date().toLocaleTimeString();

        if (currentAlert === 'true') {
            patient.highalert = 'false';
            action = actedUser.name + ' ' + actedUser.lastName + ' remove Alert status.'
        } else {
            patient.highalert = 'true';
            action = actedUser.name + ' ' + actedUser.lastName + ' assign Alert status'
        }
        //update alert 
        this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + patient.guid)
            .update(patient)
            .then(function () {
                console.log('Update Patient\'s alert:True')
            })
            .catch(function (err) {
                console.error('Update Patient\'s alert:False, status:', err);
            })
        //save patient info log
        this.afs.collection('branch/' + this.currentuser.branchGUID + '/patients/' + patient.guid + '/patient-log')
            .add({ actedUser, action, date, time })
            .then(function () {
                console.log('success add patient high alert log');
            })
            .catch(function (err) {
                console.log('failed to insert new high alert log');
            })

    }

    deselectPatient() {
        this.selectedPatient = [];

        // Trigger the next event
        this.onSelectedPatientChanged.next(this.selectedPatient);
    }

    deletePatient(patient) {
        const patientIndex = this.patient.indexOf(patient);
        this.patient.splice(patientIndex, 1);
        this.onPatientChanged.next(this.patient);
    }

    deleteSelectedPatient() {
        for (const patientId of this.selectedPatient) {
            const patient = this.patient.find(_patient => {
                return _patient.id === patientId;
            });
            const patientIndex = this.patient.indexOf(patient);
            this.patient.splice(patientIndex, 1);
        }
        this.onPatientChanged.next(this.patient);
        this.deselectPatient();
    }

    saveAlert(patient) {
        //let temp = this.getDoctorFromList(doctorId)
        // this.patient.current_assigned_doctor = temp.name;

        // this.afs.doc('patient/' + this.patientGUID)
        // .update(this.patient)
        // .then(function () {
        //     console.log('Update Patient\'s current_assigned_doctor:True')
        // })
        // .catch(function (err) {
        //     console.error('Update Patient\'s current_assigned_doctor:False, status:', err);
        // })
    }

}
