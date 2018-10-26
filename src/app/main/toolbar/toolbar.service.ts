import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FuseUtils } from '../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';

export interface Branch { 
    name: string; 
    guid:string
}

@Injectable()
export class ToolbarService implements Resolve<any>
{
    onBranchChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    private branchCollection: AngularFirestoreCollection<any>;

    branch: Branch[];

    constructor(
        private readonly bfs: AngularFirestore,
        public snackbar: MatSnackBar
    ){
      this.branchCollection = bfs.collection<Branch>('branch');
    }

    /**
     * The Branch App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getBranch(),
            ]).then(
                ([files]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getBranch(): Promise<any>{
        return new Promise((resolve, reject)=> {
          this.bfs.collection<Branch>('branch').snapshotChanges().map(actions => {
            return actions.map(action => {
                const data = action.payload.doc.data() as Branch;
                data.guid = action.payload.doc.id;
                return data ;
                });
            })
            .subscribe((response: any) => {
                this.branch = response;
                // console.log('tool-service-branch',this.branch)
                this.onBranchChanged.next(this.branch);
                resolve(this.branch);
            }, reject);
        });
    }

}
