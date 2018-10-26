import { Injectable } from '@angular/core';
import { OccassionService } from './occassionService.model';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { FuseUtils } from '../../../../core/fuseUtils';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { medication } from '../../medication/medication.model';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { promise } from 'protractor';
import { OnDestroy } from '@angular/core';
import { Contact} from '../../users/contact.model';
import { FusePatientInfoService } from "./patient-info.service";

@Injectable()
export class ServiceVisitNode implements Resolve<any> {

 ocassiondata : OccassionService;
 patientGUID: string;

 visitGUID : string;
 medicationstructure : medication;
 medication : medication[];
 currentUser : Contact;
 onMedicationChanged: BehaviorSubject<any> = new BehaviorSubject([]);
 onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);


    constructor(
        public readonly afs:AngularFirestore,
        public afAuth : AngularFireAuth,
        public snackBar: MatSnackBar,
        private readonly patientInfoService:FusePatientInfoService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentuser'));
        this.patientGUID = this.patientInfoService.patientGUID;
     }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {   
        console.log('visit.service vn:',route.paramMap.get('visits'));
        this.visitGUID = route.paramMap.get('visits');
        return new Promise((resolve, reject) => {
            Promise.all([
            this.getMedication(),
            ]).then(
                ([files]) => {
                    resolve();
                },
                reject
            );
        });

    }

    getMedication(): Promise<any> {
        // var test = this.getvisitdata(this.visitGUID)
        // console.log('iside the getmedication',test)

        return new Promise((resolve, reject) => {

            this.afs.collection<medication>('branch/'+ this.currentUser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + this.visitGUID + '/medication')
                .snapshotChanges().map(action =>{
                    return action.map (action =>{
                    const data = action.payload.doc.data() as medication;
                    const guid = action.payload.doc.id ;
                    return {guid, ...data};
                    });
                })
                .subscribe(response => {
                    this.medication = response;
                    this.onMedicationChanged.next(this.medication);
                    resolve(this.medication);
                }, reject);
        }
        );
    }

    insertMedication(visitnote, medForm) {
        console.log('id', visitnote);
        console.log('pid', this.patientGUID);
        return this.afs.doc<medication>('branch/'+ this.currentUser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitnote + '/medication/' + medForm.id)
            .set(medForm)
            .then(()=> {
                return medForm;
            }).catch(error => {
                console.log(error);
                return error;
            })
    }

    updateMedication(visitnote, medForm) {
        let update = this.afs.doc<medication>('branch/'+ this.currentUser.branchGUID + '/patients/' + this.patientGUID + '/visitnotes/' + visitnote + '/medication/' + medForm.id)
            .set(medForm);

        return update
            .then(function () {
                console.log('Update: true', medForm);
            })
            .catch(function (err) {
                console.error("Update: false, status:", err)
            });
    }

    deleteMedication(visitnote,medication)
        {
         return this.afs.doc<medication>('branch/'+ this.currentUser.branchGUID +'/patients/' + this.patientGUID + '/visitnotes/' + visitnote + '/medication/' + medication.id).delete()
        }
     DatabaseMedication(Data)
        {
           return this.afs.doc('medication/'+ Data.id).set(Data);
        }

}
