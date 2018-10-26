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

@Injectable()
export class ContactsService implements Resolve<any>
{
    onContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onUserDataChanged: BehaviorSubject<any> = new BehaviorSubject([]);
    onSearchTextChanged: Subject<any> = new Subject();
    onFilterChanged: Subject<any> = new Subject();


    meds: medication[];
    user: any;
    selectedContacts: string[] = [];
    
    searchText: string;
    filterBy: string;

    constructor(
     private http: HttpClient,
    public readonly afs:AngularFirestore,
    public afAuth : AngularFireAuth,
    public snackBar: MatSnackBar,  )
    {
    }

    /**
     * The Contacts App Main Resolver
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getMedications(),
                this.getUserData()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getMedications();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
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
                  const guid = action.payload.doc.id ;
                  
                  return {guid, ...data};
                
                });
              })
                    .subscribe(response => {

                        this.meds = response;
                        if ( this.filterBy === 'starred' )
                        {
                            this.meds = this.meds.filter(_contact => {
                                return this.user.starred.includes(_contact.id);
                            });
                        }

                        if ( this.filterBy === 'frequent' )
                        {
                            this.meds = this.meds.filter(_contact => {
                                return this.user.frequentContacts.includes(_contact.id);
                            });
                        }

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.meds = FuseUtils.filterArrayByString(this.meds, this.searchText);
                        }

                       

                        this.onContactsChanged.next(this.meds);
                        resolve(this.meds);
                    }, reject);
            }
        );
    }

    getUserData(): Promise<any>
    {
        return new Promise((resolve, reject) => {
                this.http.get('api/contacts-user/5725a6802d10e277a0f35724')
                    .subscribe((response: any) => {
                        this.user = response;
                        this.onUserDataChanged.next(this.user);
                        resolve(this.user);
                    }, reject);
            }
        );
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

    /**
     * Toggle select all
     */
    toggleSelectAll()
    {
        if ( this.selectedContacts.length > 0 )
        {
            this.deselectContacts();
        }
        else
        {
            this.selectContacts();
        }
    }

    selectContacts(filterParameter?, filterValue?)
    {
        this.selectedContacts = [];

        // If there is no filter, select all todos
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedContacts = [];
            this.meds.map(contact => {
                this.selectedContacts.push(contact.id);
            });
        }
        else
        {
            /* this.selectedContacts.push(...
                 this.meds.filter(todo => {
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
    //insert medication firebase  
    updateUserData(userData)
    {
        return new Promise((resolve, reject) => {
            this.http.post('api/contacts-user/' + this.user.id, {...userData})
                .subscribe(response => {
                    this.getUserData();
                    this.getMedications();
                    resolve(response);
                });
        });
    }

    deselectContacts()
    {
        this.selectedContacts = [];

        // Trigger the next event
        this.onSelectedContactsChanged.next(this.selectedContacts);
    }

    deleteContact(contact)
    {
        return this.afs.doc<medication>('medication/' + contact.id).delete();
    }

    deleteSelectedContacts()
    {
        for ( const contactId of this.selectedContacts )
        {
            const contact = this.meds.find(_contact => {
                return _contact.id === contactId;
            });
            const contactIndex = this.meds.indexOf(contact);
            this.meds.splice(contactIndex, 1);
        }
        this.onContactsChanged.next(this.meds);
        this.deselectContacts();
    }

}
