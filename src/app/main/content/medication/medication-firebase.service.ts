import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { medication } from './medication.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Action } from 'rxjs/scheduler/Action';


export interface Item { id: string; name: string; }
export interface PatientInfo{ id:string, guid:string, name:string }

@Injectable()
export class MedicationFirebaseService implements Resolve<any> {

    patient: PatientInfo[];
    onPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedPatientChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    private patientCollection: AngularFirestoreCollection<PatientInfo>;

    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();
    private itemsCollection : AngularFirestoreCollection<Item>;
    private medicationList : AngularFirestoreCollection<medication>;
    items : Observable<Item[]>;

    medications: medication[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private readonly afs:AngularFirestore,
      public afAuth : AngularFireAuth,
      public snackBar: MatSnackBar,
      private http: HttpClient)
    {
      this.medicationList = afs.collection<medication>('medication');
      this.user = localStorage.getItem('currentuser');
      console.log('curr-user',this.user.name);
      this.patientCollection = afs.collection<PatientInfo>('branch/' + this.user.branchGUID + '/patients');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    { console.log("resolve cfs")
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getMedications(),
                this.getPatients()
            ])
            .then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getMedications();
                    });
                    resolve();
                },
                reject
            );
        });
    }

    getMedications(): Promise<any>
    {   
        return new Promise((resolve, reject) => {
            
               this.afs.collection<medication>('medication').snapshotChanges().map(action =>{
                 return action.map (action =>{
                   const data = action.payload.doc.data() as medication;
                   data.id = action.payload.doc.id ;
                   
                   return data;
                 
                 });
               })
                   .subscribe(res =>{
                      this.medications = res ;
                    //   if (this.searchText && this.searchText != '')
                    //   {
                    //     this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                    //   }

                      this.onContactsChanged.next(this.medications);
                      resolve(this.medications);
                   },reject);
                   
        });
    }

    getPatients(): Promise<any> {
        // return a firebase subscription
        return new Promise((resolve, reject) => {

            this.patientCollection.snapshotChanges().map(actions => {
                return actions.map(action => {
                    const data = action.payload.doc.data() as PatientInfo;
                    data.guid = action.payload.doc.id;
                    return data;
                });
            })

                .subscribe(res => {
                    this.patient = res;

                    let mypatients = new Array<PatientInfo>();
                    let unassigned_patients = new Array<PatientInfo>();
                    let selfharm_patients = new Array<PatientInfo>();
                    let highalert_patients = new Array<PatientInfo>();
                    let userid = this.user.guid;

                    if (this.searchText && this.searchText !== '') {
                        this.patient = FuseUtils.filterArrayByString(this.patient, this.searchText);
                    }

                    this.onPatientChanged.next(this.patient);
                    resolve(this.patient);
                }, reject);
        });
    }

    getUserData(): any
    {
      //for now its not in use
      //return user
    }

    /**
     * Toggle selected contact by id
     * @param id
     */
    toggleSelectedContact(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedContacts.length > 0 )
        {
            const index = this.selectedContacts.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedContacts.splice(index, 1);

                // Trigger the next event
                this.onSelectedContactsChanged.next(this.selectedContacts);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedContacts.push(id);

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

   
    

    selectContacts(filterParameter?, filterValue?)
    {
        this.selectedContacts = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.medications.map(medication => {
                this.selectedContacts.push(medication.id);
            });
        }
        else
        {
            /* this.selectedContacts.push(...
                 this.contacts.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }
        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }
   
    
    updateContact(guid,contact)
    {
    console.log(guid);
     return this.afs.doc<medication>('medication/' + contact.id).set(contact);
    //insert medication firebase
    }  
   
    deleteContact(contact)
    {
        const contactIndex = this.medications.indexOf(contact);
        this.medications.splice(contactIndex, 1);
        this.onContactsChanged.next(this.medications);
    }


}



