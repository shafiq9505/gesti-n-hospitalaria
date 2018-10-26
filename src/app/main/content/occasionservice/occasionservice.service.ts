import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {OccassionService} from '../branches/patient-info/occassionService.model';
import { MasterConfig } from '../branches/masterconfig.model'
@Injectable()
export class OccasionserviceService {

onOccassionChanged : BehaviorSubject<any> = new BehaviorSubject([])
onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
onSearchTextChanged: Subject<any> = new Subject();
onFilterChanged: Subject<any> = new Subject();
occassion : OccassionService[];
onCategoryChanged: BehaviorSubject<any> = new BehaviorSubject([]);

searchText: string;
filterBy: string;
category: MasterConfig[];

constructor(
 private readonly afs:AngularFirestore,
 public afAuth : AngularFireAuth,
 public snackBar: MatSnackBar,  )
 {
 }


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    return new Promise((resolve, reject) => {

        Promise.all([
         this.getOccasion(),
         this.getCategory()
        ]).then(
            ([files]) => {

                this.onSearchTextChanged.subscribe(searchText => {
                    this.searchText = searchText;
                    this.getOccasion()
                });

                this.onFilterChanged.subscribe(filter => {
                    this.filterBy = filter;
                    this.getOccasion()
                });

                resolve();

            },
            reject
        );
    });
}

getOccasion() : Promise<any>
{   
  return new Promise((resolve, reject) => {
      this.afs.collection<OccassionService>('occassionservice').snapshotChanges().map(action =>{
          return action.map (action =>{
            const data = action.payload.doc.data() as OccassionService;
            data.id = action.payload.doc.id ;
            return data;
          });
        })
        .subscribe(response => {
            this.occassion = response;
            if ( this.searchText && this.searchText !== '' )
            {
                this.occassion = FuseUtils.filterArrayByString(this.occassion, this.searchText);
            }
            this.onOccassionChanged.next(this.occassion);
            resolve(this.occassion);
        }, reject);
      }
  );
}

UpdateOccasion(occassion)
{
 return this.afs.doc<OccassionService>('occassionservice/' + occassion.id).set(occassion)
}

deleteOccassion(occassion)
{
    return this.afs.doc<OccassionService>('occassionservice/' + occassion.id).delete()
}

getCategory()
{
    return new Promise((resolve, reject) => {
        this.afs.collection<MasterConfig>('masterconfig/').snapshotChanges().map(action =>{
            return action.map (action =>{
            const data = action.payload.doc.data() as MasterConfig;
            data.id = action.payload.doc.id ;
            return data;  
            });
        })
        .subscribe(response => {
            this.category = response;
            this.onCategoryChanged.next(this.category);
            resolve(this.category);
        }, reject);
        }
    );
}
}
