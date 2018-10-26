import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { medication } from '../../../medication/medication.model';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { promise } from 'protractor';



@Injectable()
export class MedicationService implements Resolve<any>  {
  medicationlist : any;

  // onContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  
  contacts: medication[];
  medication: medication[];
  onMedicationChange: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
     private readonly afs:AngularFirestore,
    public afAuth : AngularFireAuth,
    // public snackBar: MatSnackBar,
    
    private firebase : AngularFireDatabase
  ) { }


  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    return new Promise((resolve, reject) =>{
     Promise.all([
        this.getData(),
        this.getdataname()      
      ]).then(([files]) => {
        resolve();
      },
      reject
    )
    })
    
  }

  getData()
  {
    const medications = this.afs.collection<medication>('medication');
    medications.valueChanges().subscribe((med: any) =>
  {
    this.medicationlist = med;
  })
    return this.medicationlist;
  }
 
  getdataname() : Promise<any>
  {
    return new Promise((resolve, reject) => {

      this.afs.collection<medication>('medication').snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as medication;
          const guid = action.payload.doc.id;
          return { guid, ...data };
        });
      })

      .subscribe(res => {
        this.medication = res;
        console.log('yawwwwwwww',medication);

        // if ( this.searchText && this.searchText !== '' )
        // {
        //     this.patient = FuseUtils.filterArrayByString(this.patient, this.searchText);
        // }

        this.onMedicationChange.next(this.medication);
        resolve(this.medication);
      }, reject);

    });
  }

  // getmedicationlist(): Promise<any>
  // {
  //   return new Promise((resolve, reject) => {
  //     this.afs.collection<medication>('medication').snapshotChanges().map(action =>{
  //         return action.map (action =>{
  //           const data = action.payload.doc.data() as medication;
  //           const guid = action.payload.doc.id ;
            
  //           return {guid, ...data};
  //         });
  //       })
  //       .subscribe(Response => {
  //       this.contacts = Response;
  //     this.onContactsChanged.next(this.contacts);
  //   resolve(this.contacts);
  //   },reject);
  // });
  // }

 /**
     * Toggle selected contact by id
     * @param id
     */
}
