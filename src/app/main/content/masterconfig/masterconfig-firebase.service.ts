import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { masterconfig } from './contact.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { Action } from 'rxjs/scheduler/Action';


export interface Item { id: string; name: string; }

@Injectable()
export class MasterconfigFirebaseService implements Resolve<any> {

  onContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();
    private itemsCollection : AngularFirestoreCollection<Item>;
    private medicationList : AngularFirestoreCollection<masterconfig>;
    items : Observable<Item[]>;

    contacts: masterconfig[];
    user: any;
    selectedContacts: string[] = [];

    searchText: string;
    filterBy: string;

    constructor(private readonly afs:AngularFirestore,
      public afAuth : AngularFireAuth,
      public snackBar: MatSnackBar,
      private http: HttpClient)
    {
      this.medicationList = afs.collection<masterconfig>('masterconfig');
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    { console.log("resolve cfs")
        return new Promise((resolve, reject) => {

            Promise.all([this.getContacts()])
            .then(
                ([files]) => {
                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getContacts();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    getContacts(): Promise<any>
    {
        return new Promise((resolve, reject) => {

               this.afs.collection<masterconfig>('masterconfig').snapshotChanges().map(action =>{
                 return action.map (action =>{
                   const data = action.payload.doc.data() as masterconfig;
                   const guid = action.payload.doc.id ;

                   return {guid, ...data};

                 });
               })
                   .subscribe(res =>{
                      this.contacts = res ;
                      console.log(this.contacts)
                    //   if (this.searchText && this.searchText != '')
                    //   {
                    //     this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
                    //   }

                      this.onContactsChanged.next(this.contacts);
                      resolve(this.contacts);
                   },reject);




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
            this.contacts.map(masterconfig => {
                this.selectedContacts.push(masterconfig.id);
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
     return this.afs.doc<masterconfig>('masterconfig/' + contact.id).set(contact);
    //insert masterconfig firebase
    }



    deleteContact(contact)
    {
        const contactIndex = this.contacts.indexOf(contact);
        this.contacts.splice(contactIndex, 1);
        this.onContactsChanged.next(this.contacts);
    }


}
