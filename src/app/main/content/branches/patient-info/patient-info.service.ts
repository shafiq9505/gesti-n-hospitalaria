import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PatientInfo } from './patient-info.model';
import { Visit } from './visit.model';
import { SelfHarm } from './selfharm.model';
import { Closure } from './closure.model';
import { FuseUtils } from '../../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { reject } from 'q';
import { AssignDoctor } from './assign-doctor.model';
import { BranchesComponent } from '../branches.component';
import { OccassionService } from './occassionService.model';
import { promise } from 'protractor';
import { Action } from 'rxjs/scheduler/Action';
import { medication } from '../../medication/medication.model';
import { NewVisitNoteFormComponent } from '../patient-info/visit-note-form/visit-note-form.component';
import { VisitNoteComponent } from '../visit-note/visit-note.component';
import { MasterConfig } from '../masterconfig.model'
export interface Patient { fname: string; lname: string }
import { CalendarEventModel } from '../../calendar/event.model';
import { Assessment } from './Assessment.model';
import { Das } from './Das.model';
import { Contact } from '../../users/contact.model';
import { Referral } from './referral-model';
import { DoctorList } from './doctor-list.model';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { TemplateFirebaseService } from '../../template/templateFirebase.Service';
import { Template } from '../../template/template.model';

export interface BranchList { id: string; name: string; address: string; city: string; postcode: string; state: string; phone: string; faxno: string; }
export interface Visit { height: string; weight: string; guid: string }
export interface Patient { fname: string; lname: string }
export interface Visit { height: string; weight: string }
export interface Template { title: string; text: string }
export interface SelfHarm { }
export interface Closure { }

@Injectable()
export class FusePatientInfoService implements Resolve<any>
{
    onPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onReferralChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedReferralChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onVisitNotesChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedVisitNoteChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onAppointmentChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onAssessmentChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onDasChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onDoctorAppointmentChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onFollowUpsChanged: BehaviorSubject<any> = new BehaviorSubject({});

    onSelfHarmChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedSelfHarmChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onClosureChanged: BehaviorSubject<any> = new BehaviorSubject({});
    onSelectedClosureChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();

    onDoctorListChanged: BehaviorSubject<any> = new BehaviorSubject([])
    onBranchListChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onAllBranchListChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onMedicationChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onCategoryChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onMedicationConfigChanged: BehaviorSubject<any> = new BehaviorSubject([]);

    private patientCollection: AngularFirestoreCollection<Patient>;
    private visitNoteColleciton: AngularFirestoreCollection<Visit>;
    private visitNoteCollection: AngularFirestoreCollection<Visit>;
    private templateCollection: AngularFirestoreCollection<Template>;
    private selfharmCollection: AngularFirestoreCollection<SelfHarm>;
    private referralCollection: AngularFirestoreCollection<Referral>;
    private closureCollection: AngularFirestoreCollection<Closure>;

    occasionservice: OccassionService;
    medicationstructure: medication;

    ocs: OccassionService[];
    medication: medication[];
    category: MasterConfig[];

    visitstring: string;
    visitGUID = FuseUtils.generateGUID()

    searchText: string;
    filterBy: string;
    visitNoteID: string
    action: string;

    patient: PatientInfo;
    visitNotes: Visit[];
    patientAppointment: CalendarEventModel[];
    doctorAppointment: CalendarEventModel[];
    patientAssessments: Assessment[];
    dass: Das[];
    score: string;
    timeStart: number;
    timeEnd: number;

    patientGUID: string;

    doctorList: DoctorList[] = [];
    branchList: BranchList[] = [];
    allBranchList: any[];
    user: any;
    selectedPatient: string[] = [];
    selfharm: SelfHarm[];
    template: Template[];
    currentuser: Contact;
    referral: Referral[];
    closure: Closure[];

    constructor(
        private readonly afs: AngularFirestore,
        private readonly tfs: AngularFirestore,
        private readonly rfs: AngularFirestore,
        public snackbar: MatSnackBar,
        // public route: ActivatedRouteSnapshot
    ) {
        this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
        this.patientCollection = afs.collection<Patient>('branch/' + this.currentuser.branchGUID + '/patients');
        this.templateCollection = tfs.collection<Template>('template');
        this.referralCollection = rfs.collection<Referral>('referral');

    }

    /**
     * The Patient App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        
        console.log('Current patient:', route.paramMap.get('id'));
        this.patientGUID = route.paramMap.get('id');

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getPatientInfo(),
                this.getPatientVisitNotes(),
                this.getDrList(),
                this.getBranchList(),
                this.getPatientAppointments(),
                this.getPatientAssessments(),
                this.getDas(),
                this.getCategory(),
                this.getMedication(),
                this.getTemplate(),
                this.getPatientSelfHarm(),
                this.getAllBranchList(),
                this.getReferral(),
                this.getPatientClosure(),
                this.getMedicationConfig()

            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getPatientInfo();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getPatientInfo();
                    });


                    resolve();

                },
                reject
            );
        });
    }


    getPatientInfo(): Promise<any> {

        return new Promise((resolve, reject) => {

            this.afs.doc<PatientInfo>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID).valueChanges()
                .subscribe(res => {
                    this.patient = res;
                    // console.log('testing ' + this.patient);
                    this.patient.id = this.patientGUID;

                    this.onPatientChanged.next(this.patient);
                    resolve(this.patient);
                }, reject);

        });
    }

    getTemplate(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.tfs.collection<Template>('template').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Template;
                            data.guid = action.payload.doc.id;
                            // console.log('data',data)
                            return data
                        });
                    })
                .subscribe(res => {
                    this.template = res;
                    // console.log('data',this.template)
                    this.onTemplateChanged.next(this.template);
                    resolve(this.template)
                }, reject)
        })
    }

    getUserData(): any {
        //return user data
    }

    getPatientVisitNotes(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<Visit>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Visit;
                            data.guid = action.payload.doc.id;
                            return data
                        });
                    })
                .subscribe(res => {
                    this.visitNotes = res;
                    this.onVisitNotesChanged.next(this.visitNotes);
                    resolve(this.visitNotes)
                }, reject)
        })
    }

    getReferral(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<Referral>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/referral-info').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Referral;
                            data.referralId = action.payload.doc.id;
                            return data
                        });
                    })
                .subscribe(res => {
                    this.referral = res;
                    this.onReferralChanged.next(this.referral);
                    resolve(this.referral)
                }, reject)
        })
    }


    getPatientAppointments(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<CalendarEventModel>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/appointments').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as CalendarEventModel;
                            data.guid = action.payload.doc.id;
                            return data;
                        });
                    })
                .subscribe(res => {
                    this.patientAppointment = res;
                    this.onAppointmentChanged.next(this.patientAppointment);
                    resolve(this.patientAppointment)
                }, reject)
        })
    }

    getPatientAssessments(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<Assessment>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/assessments').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Assessment;
                            data.guid = action.payload.doc.id;
                            return data;
                        });
                    })
                .subscribe(res => {
                    this.patientAssessments = res;
                    this.onAssessmentChanged.next(this.patientAssessments);
                    resolve(this.patientAssessments)
                }, reject)
        })
    }
    getDrList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection('contacts').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as DoctorList;
                            data.id = action.payload.doc.id;
                            return data;
                        });
                    })
                .subscribe(res => {
                    res.forEach(doctor => {
                        if (doctor.role === 'Doctor' && doctor.branchGUID === this.currentuser.branchGUID) {
                            this.doctorList.push(doctor)
                        }
                    });
                    this.onDoctorListChanged.next(this.doctorList);
                    resolve(this.doctorList);
                }, reject);
        });
    }

    getBranchList(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<BranchList>('branch').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as BranchList;
                            data.id = action.payload.doc.id;
                            return data;
                        })
                    }
                )
                .subscribe(res => {
                    this.allBranchList = res;
                    res.forEach(branch => {
                        if (branch.name === this.currentuser.branch) {
                            let position = res.indexOf(branch);
                            res.splice(position, 1);
                        }
                    })
                    this.branchList = res;
                    this.onBranchListChanged.next(this.branchList);
                    resolve(this.branchList);
                }, reject)
        })
    }

    getAllBranchList() {
        return new Promise((resolve, reject) => {
            this.afs.collection<BranchList>('branch').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as any;
                            data.guid = action.payload.doc.id;
                            return data;
                        })
                    }
                )
                .subscribe(res => {
                    this.allBranchList = res;
                    this.onAllBranchListChanged.next(this.allBranchList);
                    resolve(this.allBranchList);
                }, reject)
        })
    }


    getDas(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<Das>('assessments/dass21/questions').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Das;
                            data.guid = action.payload.doc.id;
                            return data;
                        });
                    })
                .subscribe(res => {
                    this.dass = res;
                    this.onDasChanged.next(this.dass);
                    resolve(this.dass)
                }, reject)
        })
    }

    getDoctorAppointments(): Promise<any> {
        if(this.patient.doctorid === ''){
            console.warn('Patient info.doctorid', this.patient.doctorid)
            return;
        }else {
            return new Promise((resolve, reject) => {
                this.afs.collection<CalendarEventModel>('contacts/' + this.patient.doctorid + '/appointments').snapshotChanges()
                    .map(
                        actions => {
                            return actions.map(action => {
                                const data = action.payload.doc.data() as CalendarEventModel;
                                data.guid = action.payload.doc.id;
                                return data;
                            });
                        })
                    .subscribe(res => {
                        this.doctorAppointment = res;
                        this.onDoctorAppointmentChanged.next(this.doctorAppointment);
                        resolve(this.doctorAppointment)
                    }, reject)
            })
        }
    }

    referPatientToDoctor(docId) {
        if (!docId) {
            console.log('save assignTo failed!');
            return;
        }

        this.savePatientToDoctor(docId);
        this.saveDoctorToPatient(docId);
        alert('Assign Patient to Doctor Success');

    }

    savePatientToDoctor(doctorId) {
        this.afs.collection('contacts/' + doctorId + '/assigned-patient').add(this.patient)
            .then(function () {
                console.log('Add assigned-patient To Doctor : true')
            })
            .catch(function (err) {
                console.error('Add assigned-patient to Doctor :false', 'status:', err);
            })
    }

    saveDoctorToPatient(doctorId) {
        let temp = this.getDoctorFromList(doctorId)
        this.patient.current_assigned_doctor = temp.name;
        this.patient.doctorid = temp.id;

        this.afs.collection('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/referred-doctor')
            .add(this.getDoctorFromList(doctorId))
            .then(function () {
                console.log('saveDoctorToPatient:true')

            })
            .catch(function (err) {
                console.error('saveDoctorToPatient:False, status:', err);
            })

        this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID)
            .update(this.patient)
            .then(function () {
                console.log('Update Patient\'s current_assigned_doctor:True')
            })
            .catch(function (err) {
                console.error('Update Patient\'s current_assigned_doctor:False, status:', err);
            })
    }

    getDoctorFromList(doctorId) {
        let temp = this.doctorList.filter(
            doctor => doctor.id === doctorId
        );
        return temp[0];
    }


    referToDoctor(patient, doctor) {
        // console.log('Loct: patient-info.service', 'Funct: referToDoctor', 'Patient: ', patient, 'Doctor: ', doctor);

        if (!patient || !doctor) {
            // console.log('Loct: patient-info.service', 'action: return', 'Patient: ', patient, 'Doctor: ', doctor);
            return;
        }
    }

    referPatientExternal(referralNote) {
        if (!referralNote) {
            console.warn('Empty referralNote');
            return;
        }
        this.afs.collection('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/referral-info')
            .add(referralNote)
            .then(function () {
                console.log('Add external referral-info To Patient : true')
            })
            .catch(function (err) {
                console.error('Add external referral-info to Patient :false', 'status:', err);
            })
        alert('Referring patient to another party is success. Please wait for the required file to download.');
    }

    getPatientSelfHarm(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<SelfHarm>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/selfharm').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as SelfHarm;
                            const guid = action.payload.doc.id;
                            return { guid, ...data }
                        });
                    })
                .subscribe(res => {
                    this.selfharm = res;
                    this.onSelfHarmChanged.next(this.selfharm);
                    resolve(this.selfharm)
                }, reject)
        })
    }

    newSelfHarm(newSelfHarm) {
        console.log('Loct: patient-info.service', 'Funct: newSelfHarm', 'selfharm:', newSelfHarm)
        this.afs.collection<SelfHarm>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/selfharm').add(newSelfHarm)
            .then(function () {
                console.log('Add: true');
            })
            .catch(function (err) {
                console.error('Add: false', 'status:', err);
            });

        this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID).update({ selfharm_status: true }).then(result => {
            console.log("success");
            console.log(result);
        })
            .catch(error => {
                console.log("Failed: " + error);
            });
    }

    updateSelfHarm(newSelfHarm) {
        console.log('Loct: patient-info.service', 'Funct: updateSelfHarm', 'selfharm:', newSelfHarm)

        let update_patient_selfharm = this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/selfharm/' + newSelfHarm.guid)

        return update_patient_selfharm.update(newSelfHarm)
            .then(function () {
                console.log('Update: true');
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deleteSelfHarm(targetSelfHarm) {
        console.log('Loct: patient-info.service', 'Funct: deleteSelfHarm', 'target:', targetSelfHarm)

        let del = this.afs.doc('patient/' + this.patientGUID + '/selfharm/' + targetSelfHarm.guid)
        return del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });
    }

    referPatientToBranch(branchInfo, referralNote) {
        if (!branchInfo || !referralNote) {
            console.warn('Error, branchInfo', branchInfo.name, 'referranlNote:', referralNote)
            return
        }

        this.patient.current_assigned_doctor = '';
        this.patient.current_assigned_branch = branchInfo.name;
        let patient = this.afs.collection('branch/' + branchInfo.id + '/patients').add(this.patient)
            .then(function () {
                console.warn('Add patient to branch success');
            })
            .catch(function (err) {
                console.error('Add patient to branch: False, err:', err);
            })

        // this.afs.collection('branch/' + this.currentuser.branchGUID + '/nonactivepatients/' + this.patientGUID + '/referral-info').add(referralNote)
        //     .then(function () {
        //         console.warn('Add referralNote to patient referral-info success');
        //     })
        //     .catch(function (err) {
        //         console.error('Add referralNote to patient referral-info: False, err:', err);
        //     })

        // this.afs.doc('patient/' + this.patientGUID)
        //     .update(this.patient)
        //     .then(function () {
        //         console.log('Update Patient\'s current_assigned_doctor:True')
        //     })
        //     .catch(function (err) {
        //         console.error('Update Patient\'s current_assigned_doctor:False, status:', err);
        //     })
        alert('Referring patient to another branch is success. Please wait for the required file to download.');
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
            this.selectPatient();
        }
    }

    selectPatient(filterParameter?, filterValue?) {
        // this.selectedPatient = [];

        // If there is no filter, select all todos
        // if ( filterParameter === undefined || filterValue === undefined )
        // {
        // this.selectedPatient = [];
        // this.patient.map(patient => {
        // this.selectedPatient.push(patient.id);
        // });
        // }
        // else
        // {
        /* this.selectedPatient.push(...
             this.patient.filter(todo => {
                 return todo[filterParameter] === filterValue;
             })
         );*/
        // }

        // Trigger the next event
        // this.onSelectedPatientChanged.next(this.selectedPatient);
    }

    // updatePatient(patient)
    // {
    //     return new Promise((resolve, reject) => {
    //
    //         this.http.post('patient' + patient.id, {...patient})
    //             .subscribe(response => {
    //                 this.getPatient();
    //                 resolve(response);
    //             });
    //     });
    // }

    // updateUserData(userData)
    // {
    //     return new Promise((resolve, reject) => {
    //         this.http.post('patient' + this.user.id, {...userData})
    //             .subscribe(response => {
    //                 this.getUserData();
    //                 this.getPatient();
    //                 resolve(response);
    //             });
    //     });
    // }

    deselectPatient() {
        // this.selectedPatient = [];
        //
        // // Trigger the next event
        // this.onSelectedPatientChanged.next(this.selectedPatient);
    }

    deletePatient(patient) {
        // const patientIndex = this.patient.indexOf(patient);
        // this.patient.splice(patientIndex, 1);
        // this.onPatientChanged.next(this.patient);
    }

    deleteSelectedPatient() {
        //     for ( const patientId of this.selectedPatient )
        //     {
        //         const patient = this.patient.find(_patient => {
        //             return _patient.id === patientId;
        //         });
        //         const patientIndex = this.patient.indexOf(patient);
        //         this.patient.splice(patientIndex, 1);
        //     }
        //     this.onPatientChanged.next(this.patient);
        //     this.deselectPatient();
    }

    passPatientGUID(): string {
        return (this.patientGUID)
    }

    getCategory(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<MasterConfig>('masterconfig/').snapshotChanges().map(action => {
                return action.map(action => {
                    const data = action.payload.doc.data() as MasterConfig;

                    data.id = action.payload.doc.id;
                    return data
                });
            })
                .subscribe(Response => {
                    this.category = Response;
                    this.onCategoryChanged.next(this.category);
                    resolve(this.category);
                }, reject)
        })
    }

    getMedicationConfig():Promise<any>{
        return new Promise((resolve, reject) => {
            this.afs.collection<medication>('medicationConfig/').snapshotChanges().map(action => {
                return action.map(action => {
                    const data = action.payload.doc.data() as medication;

                    data.id = action.payload.doc.id;
                    return data
                });
            })
                .subscribe(Response => {
                    this.medication = Response;
                    this.onMedicationConfigChanged.next(this.medication);
                    resolve(this.medication);
                }, reject)
        })
    }

    getvisitNoteIdFromComponent(visit) {
        this.visitNoteID = visit
        // console.warn('Visit note id in the service', this.visitNoteID);

    }



    getMedication(): any {
        // var test = this.getvisitdata(this.visitGUID)
        // console.log('iside the getmedication',test)

        return new Promise((resolve, reject) => {

            this.afs.collection<medication>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + this.visitGUID + '/medication').snapshotChanges().map(action => {

                return action.map(action => {
                    const data = action.payload.doc.data() as medication;
                    const guid = action.payload.doc.id;
                    return { guid, ...data };
                });
                
            })
                .subscribe(response => {
                    this.medication = response;
                    this.onMedicationChanged.next(this.medication);
                    resolve(this.medication);
                }, reject)

        }
        );
    }


    getOccasionService(): Promise<any> {

        return new Promise((resolve, data) => {
            this.afs.collection<OccassionService>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + + '/occasionservice').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as OccassionService;
                            data.id = action.payload.doc.id;
                            return data

                        });
                    })
                .subscribe(res => {
                    this.ocs = res;
                    resolve(this.ocs);
                }, )
        })
    }

    insertOccasionService(visitnote, occasionAny) {
        this.afs.collection<OccassionService>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitnote + '/occasionservice/')
            .add(occasionAny);

    }
    insertOccasionServiceToBeEdit(occassionAny) {
        return this.afs.doc<OccassionService>('occassionservice/' + occassionAny.id).set(occassionAny);
    }

    UpdateOccassionService(guid, visitnote, occasionAny) {
        let update = this.afs.doc<OccassionService>('patient/' + this.patientGUID + '/visitnotes/' + visitnote + '/occasionservice/' + guid)

        return update.update(guid)
            .then(function () {
                console.log('Update: true');
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deleteVisitNote(visitNote) {
        //  console.log('loct: patient-info.service', 'action: delete visitnote', 'visitnote:', visitNote)
        // return this.afs.doc<medication>('branch/'+ this.currentuser.branchGUID +'/patients/' + this.patientGUID + '/visitnotes/' + this.visitGUID + '/medication/' + medication.id).delete()
        let del = this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitNote.guid)

        return del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });
    }

    newPatientAppointment(event: CalendarEventModel) {
        event.guid = FuseUtils.generateGUID();
        event.patient = this.patient.fname;
        // event.start = addHours((event.start), this.timeStart + eval(event.hourStart));
        // event.end = addHours((event.end), this.timeEnd + eval(event.hourEnd));

        this.afs.doc<CalendarEventModel>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/appointments/' + event.guid).set(event);
        this.afs.doc<CalendarEventModel>('contacts/' + this.patient.doctorid + '/appointments/' + event.guid).set(event);
        this.afs.doc<CalendarEventModel>('calendar/' + event.guid).set(event);

        return;
    }

    updatePatientAppointment(appointment) {
        // console.log('loct: patient-info.service', 'action: update visitnote', 'visitnote:', appointment);

        let update = this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/appointments/' + appointment.guid);

        update.update(appointment);

        update = this.afs.doc('calendar/' + appointment.guid);

        return update.update(appointment)
            .then(function () {
                console.log('Update: true');
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deletePatientAppointment(appointment) {
        let del = this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/appointments/' + appointment.guid);

        del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });


        del = this.afs.doc('contacts/' + this.patient.doctorid + '/appointments/' + appointment.guid);

        del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });


        del = this.afs.doc('calendar/' + appointment.guid)

        del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });

        return;
    }

    newPatientAssessment(assessment: Assessment) {
        assessment.type = 'DASS 21';
        assessment.result = this.score;
        assessment.doctor_name = this.patient.current_assigned_doctor;
        return this.afs.collection<Assessment>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/assessments/').add(assessment)
            .then(function () {
                console.log('Add: true');
            })
            .catch(function (err) {
                console.error("Add: false, status:", err)
            });
    }

    calculateDas(depression, anxiety, stress) {
        this.score = depression + '/' + anxiety + '/' + stress;
    }

    setAppointmentHour(start, end) {
        this.timeStart = start;
        this.timeEnd = end;

    }

    newOccasionService(newvisitnodeid, occasionAny) {
        return this.afs.collection<OccassionService>('patient/' + this.patientGUID + '/visitnotes/' + newvisitnodeid + '/occasionservice/')
            .add(occasionAny)
    }

    newVisitNote(visitnote) {
        return this.afs.doc<Visit>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitnote.guid).set(visitnote)

        // this.afs.collection<Visit>('branch/'+ this.currentuser.branchGUID +'/patients/' + this.patientGUID + '/visitnotes').add(visitnote)
        //     .then(function () {
        //         console.log('Add: true');
        //     })
        //     .catch(function (err) {
        //         console.error("Add: false, status:", err)
        //     });
    }

    updateVisitNote(visitNote) {
        // console.log('loct: patient-info.service', 'action: update visitnote', 'visitnote:', visitNote)

        return this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitNote.guid).set(visitNote);
        // let update = this.afs.doc('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitNote.guid)


    }

    getCategoryFromMaster(): any {
        return this.afs.collection<'category'>('masterconfig').snapshotChanges()
    }

    PushDataMedicationToDatabase(visitId): any {
        //data medication name
        this.afs.doc('patient' + this.patientGUID + '')
        //data patient name
        this.afs.doc('patient/' + this.patientGUID)
        //data date of visit note
        this.afs.doc('patient/' + this.patientGUID + 'visitnotes' + visitId)
        //push to medication database
        this.afs.doc('medication/')
    }
    insertMedication(visitnote, medForm) {
        return this.afs.doc<medication>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitnote + '/medication/' + medForm.id)
            .set(medForm);
    }

    updateMedication(medForm) {
        let update = this.afs.doc<medication>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + this.visitGUID + '/medication/' + medForm.id)
            .set(medForm);

        return update
            .then(function () {
                console.log('Update: true', medForm);
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deleteMedication(medication) {
        return this.afs.doc<medication>('branch/' + this.currentuser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + this.visitGUID + '/medication/' + medication.id).delete()
    }
    DatabaseMedication(Data) {
        return this.afs.doc('medication/' + Data.id).set(Data);
    }

    getUserBranchDetail() {
        let temp = this.allBranchList.filter(
            branch => branch.guid === this.currentuser.branchGUID
        );
        return temp[0];
    }

    getPatientClosure(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.afs.collection<Closure>('patient/' + this.patientGUID + '/closure').snapshotChanges()
                .map(
                    actions => {
                        return actions.map(action => {
                            const data = action.payload.doc.data() as Closure;
                            const guid = action.payload.doc.id;
                            return { guid, ...data }
                        });
                    })
                .subscribe(res => {
                    this.closure = res;
                    this.onClosureChanged.next(this.closure);
                    resolve(this.closure)
                }, reject)
        })
    }

    newClosure(newClosure) {
        console.log('Loct: patient-info.service', 'Funct: newClosure', 'closure:', newClosure)
        this.afs.collection<Closure>('patient/' + this.patientGUID + '/closure').add(newClosure)
            .then(function () {
                console.log('Add: true');
            })
            .catch(function (err) {
                console.error('Add: false', 'status:', err);
            });
        // this.afs.doc('patient/' + this.patientGUID).update({ closure_status: true }).then(result => {
        //     console.log("success");
        //     console.log(result);
        // })
        //     .catch(error => {
        //         console.log("Failed: " + error);
        //     });
    }

    updateClosure(newClosure) {
        console.log('Loct: patient-info.service', 'Funct: updateClosure', 'closure:', newClosure)

        let update_patient_closure = this.afs.doc('patient/' + this.patientGUID + '/closure/' + newClosure.guid)

        return update_patient_closure.update(newClosure)
            .then(function () {
                console.log('Update: true');
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deleteClosure(targetClosure) {
        console.log('Loct: patient-info.service', 'Funct: deleteClosure', 'target:', targetClosure)

        let del = this.afs.doc('patient/' + this.patientGUID + '/closure/' + targetClosure.guid)
        return del.delete()
            .then(function () {
                console.log('Delete: true');
            })
            .catch(function (err) {
                console.error("Delete: false, status:", err)
            });
    }
}
