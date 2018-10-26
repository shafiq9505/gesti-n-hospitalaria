import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Branch } from './branch.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';


@Injectable()
export class BranchService implements Resolve<any>
{
    onBranchChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedBranchChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();
    private branchCollection: AngularFirestoreCollection<Branch>;

    branch: Branch[];
    user: any;
    selectedBranch: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private readonly bfs: AngularFirestore,
    public snackbar: MatSnackBar){
      this.branchCollection = bfs.collection<Branch>('branch');
    }

    /**
     * The Branch App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
      console.log("resolve bfs")
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getBranch(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getBranch();
                    });

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
            if ( this.searchText && this.searchText !== '' )
            {
                this.branch = FuseUtils.filterArrayByString(this.branch, this.searchText);
            }
            this.onBranchChanged.next(this.branch);
            resolve(this.branch);
            }, reject);
        });
    }

    getUserData():any
    {
        // return new Promise((resolve, reject) => {
        //         this.http.get('contacts')
        //             .subscribe((response: any) => {
        //                 this.user = response;
        //                 this.onUserDataChanged.next(this.user);
        //                 resolve(this.user);
        //             }, reject);
        //     }
        // );
    }

    /**
     * Toggle selected branch by id
     * @param id
     */
    toggleSelectedBranch(id)
    {
        // First, check if we already have that todo as selected...
        if ( this.selectedBranch.length > 0 )
        {
            const index = this.selectedBranch.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedBranch.splice(index, 1);

                // Trigger the next event
                this.onSelectedBranchChanged.next(this.selectedBranch);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedBranch.push(id);

        // Trigger the next event
        this.onSelectedBranchChanged.next(this.selectedBranch);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedBranch.length > 0 )
        {
            this.deselectBranch();
        }
        else
        {
            this.selectBranch();
        }
    }

    selectBranch(filterParameter?, filterValue?)
    {
        this.selectedBranch = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedBranch = [];
            this.branch.map(branch => {
                this.selectedBranch.push(branch.id);
            });
        }
        else
        {
            /* this.selectedBranch.push(...
                 this.branch.filter(todo => {
                     return todo[filterParameter] === filterValue;
                 })
             );*/
        }

        // Trigger the next event
        this.onSelectedBranchChanged.next(this.selectedBranch);
    }

    updateBranch(guid, branch)
    {
      console.log(guid);
      console.log("updateBranch");
      //   return this.bfs.doc<Branch>('branch/' + guid).set(branch);
        this.branchCollection.doc(guid).update(branch)
        .then(()=> {
            console.log('update branch success');
        })
        .catch( error=>{
            console.error('update failed',error);
        })
    }

    newBranch(branch)
    {
    //   console.log('added branch',branch);
      console.log("firebase branch add");
      this.branchCollection.add(branch);

    }

    updateUserData(userData)
    {
        // return new Promise((resolve, reject) => {
        //     this.http.post('api/branch-user/' + this.user.id, {...userData})
        //         .subscribe(response => {
        //             this.getUserData();
        //             this.getBranch();
        //             resolve(response);
        //         });
        // });
    }

    deselectBranch()
    {
        this.selectedBranch = [];

        // Trigger the next event
        this.onSelectedBranchChanged.next(this.selectedBranch);
    }

    deleteBranch(branch)
    {
        console.log('deleteBranch');
        // const branchIndex = this.branch.indexOf(branch);
        // this.branch.splice(branchIndex, 1);
        // this.onBranchChanged.next(this.branch);
        this.branchCollection.doc(branch.guid).delete()
        .then(() => {
            console.log('deleting branch', branch.guid);
        })
        .catch(error => {
            console.error('failed to delete branch',error);
        })
    }

    deleteSelectedBranch()
    {
        for ( const branchId of this.selectedBranch )
        {
            const branch = this.branch.find(_branch => {
                return _branch.id === branchId;
            });
            const branchIndex = this.branch.indexOf(branch);
            this.branch.splice(branchIndex, 1);
        }
        this.onBranchChanged.next(this.branch);
        this.deselectBranch();
    }

}
