import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Contact } from './contact.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { reject } from 'q';
import { BranchService } from '../branchmgt/branch.service';
import { Branch } from '../branchmgt/branch.model';

export interface Item { id: string; name: string; }

// export interface Branch { guid:string, name: string; adress: string }

@Injectable()
export class ContactsFirebaseService implements Resolve<any>
{

  onSelectedContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onContactsChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  onBranchChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSelectedBranchChanged: BehaviorSubject<any> = new BehaviorSubject([]);

  private itemsCollection: AngularFirestoreCollection<Item>;
  private contactsCollection: AngularFirestoreCollection<Contact>;
  private branchCollection: AngularFirestoreCollection<Branch>;

  items: Observable<Item[]>;
  contacts: any[] = [];
  branch: Branch[];
  user: any;
  selectedContacts: string[] = [];
  totalBranch = 0;
  totalUser = 0;

  branchGUID: string;


  searchText: string;
  filterBy: string;

  currentuser:Contact

  constructor(
    private readonly afs: AngularFirestore,
    public readonly afAuth: AngularFireAuth,
    public readonly bfs: AngularFirestore,
    public readonly cfs: AngularFirestore,

    public snackBar: MatSnackBar,
  ){
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.contactsCollection = cfs.collection<Contact>('contacts');
    this.branchCollection = bfs.collection<Branch>('branch');
    //console.log('user login:', this.currentuser)
  }

  /**
   * The Patient App Main Resolver
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {Observable<any> | Promise<any> | any}
   */


  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    console.log("resolve cfs");
    // this.contactsCollection = this.afs.collection<Contact>('contacts');
    // return this.contactsCollection;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getContacts(),
        this.getBranch()
      ])
      .then(
        ([files]) => {
          this.onSearchTextChanged.subscribe(searchText => {
            console.log(searchText);
            this.searchText = searchText;
            this.getContacts();
          });

          resolve();

        },
        reject
      );
    });
  }

  getContacts(): Promise<any> {
    // return a firebase subscription
    return new Promise((resolve, reject) => {

      this.cfs.collection<Contact>('contacts').snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Contact;
          data.guid = action.payload.doc.id;
          return data;
        });
      })
      .subscribe(res => {
        this.contacts = res
        // if(this.currentuser.role === 'Admin'){
        //   this.contacts = res
        //   console.log('number of contacts as admin:', this.contacts.length)
        // } else {
        //   res.forEach(user => {
        //     if (user.branchGUID === this.currentuser.branchGUID && this.contacts.indexOf(user) !==-1) {
        //       this.contacts.push(user);
        //     }
        //   })
        // }

        if ( this.searchText && this.searchText !== '' )
        {
            this.contacts = FuseUtils.filterArrayByString(this.contacts, this.searchText);
        }

        if ( this.filterBy === 'starred' )
        {
            this.contacts = this.contacts.filter( contact => {
                console.log("user-id", contact.id);
                return this.user.starred.includes( contact.id);
            });
        }


        this.onContactsChanged.next(this.contacts);
        resolve(this.contacts);
      }, reject);

    });
  }

  getUserData(): any {
    //return user data
  }

  getBranch(): Promise<any>{
    return new Promise((resolve, reject)=>{
      this.bfs.collection<Branch>('branch').snapshotChanges()
        .map(
          actions => {
            return actions.map( action=> {
              const data = action.payload.doc.data() as Branch;
              data.guid = action.payload.doc.id;
              this.totalBranch += 1;
              return data
            });
          })
          .subscribe(res=>{
            this.branch = res;
            this.totalBranch = 0;
            this.onBranchChanged.next(this.branch);
            resolve(this.branch)
          }, reject)
    })
  }

  toggleSelectedContact(id)
  {
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

  toggleSelectAll()
  {

  }

  selectContacts(filterParameter?, filterValue?)
  {
    this.selectedContacts = [];

    // If there is no filter, select all todos
    if ( filterParameter === undefined || filterValue === undefined )
    {
        this.selectedContacts = [];
        this.contacts.map(contact => {
            // this.selectedContacts.push(contact.id);
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

  updateContact(guid, contact)
  {
    console.log('updating...')
    this.afs.doc<Contact>('contacts/' + guid)
      .update(contact)
        .then(() => {
          console.log('update success')
        })
        .catch(error=>{
          console.error('update failed', error)
        });
  }

  newContact(contact)
  {
    //register new user and password
    this.afAuth.auth.createUserWithEmailAndPassword(contact.email, contact.password)
    .then(() => {
      console.log('firebase(auth): success');
      //contact.uid = user.uid;
      this.InserIntoContactList(contact)
      console.log('new-user');
    })
    .catch(error => {
      console.error('firebase(auth):failed',error);
      this.snackBar.open(error.message, 'OK', {
          verticalPosition: 'top',
          duration        : 10000
      });
    });

  }

  getContact(email)
  {
    return this.afs.collection('contacts', ref => ref.where('email', '==', email).limit(1)).valueChanges();
  }

  updateUserData(userData)
  {

  }

  deselectContacts()
  {
    this.selectedContacts = [];

    // Trigger the next event
    this.onSelectedContactsChanged.next(this.selectedContacts);

  }

  deleteContact(contact)
  {
    console.log('deleting...')
    let userToDelete = this.contacts.filter( function(user){
      return user.guid === contact.guid
    });
    // console.log(userToDelete);
    this.afs.doc<Contact>('contacts/' + contact.guid).delete()
      .then(() => {
        console.log('delete user success');
      })
      .catch( error => {
        console.error('Delete user failed', error);
      })
  }

  deleteSelectedContacts()
  {

  }

  InserIntoContactList(newUser){
    let path = "contacts";
    this.contactsCollection.add(newUser)
    .then(() => {
      console.log('save contact list');
    })
    .catch(err => {
      console.error('failed to save contact', err);
      
    });
  }
}
