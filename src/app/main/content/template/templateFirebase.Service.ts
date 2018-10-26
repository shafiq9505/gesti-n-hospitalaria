import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Template } from './template.model';
import { FuseUtils } from '../../../core/fuseUtils';
import { Subject } from 'rxjs/Subject';
// import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';

export interface Item { id: string; name: string; }

// export interface Template {
//     guid: string;
//     id: string;
//     name: string;
//     lastName: string;
//     avatar: string;
//     nickname: string;
//     company: string;
//     jobTitle: string;
//     email: string;
//     phone: string;
//     address: string;
//     birthday: string;
//     notes: string;
// }

@Injectable()
export class TemplateFirebaseService implements Resolve<any>
{

  onSelectedTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  onSearchTextChanged: Subject<any> = new Subject();
  onTemplateChanged: BehaviorSubject<any> = new BehaviorSubject([]);
  private itemsCollection: AngularFirestoreCollection<Item>;
  private templateCollection: AngularFirestoreCollection<Template>;
  items: Observable<Item[]>;

  template: Template[];
  user: any;
  selectedTemplate: string[] = [];

  searchText: string;
  filterBy: string;

  constructor(private readonly tfs: AngularFirestore,
    // public afAuth: AngularFireAuth,
    public snackBar: MatSnackBar) {
    this.templateCollection = tfs.collection<Template>('template');
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
  {
    console.log("resolve tfs");
    // this.templateCollection = this.afs.collection<Template>('template');
    // return this.templateCollection;
    return new Promise((resolve, reject) => {
      Promise.all([
        this.getTemplate()
      ]).then(
        ([files]) => {

          this.onSearchTextChanged.subscribe(searchText => {
            console.log(searchText);
            this.searchText = searchText;
            this.getTemplate();
          });

          resolve();

        },
        reject
      );
    });
  }

  getTemplate(): Promise<any> {
    // return a firebase subscription
    return new Promise((resolve, reject) => {

      this.tfs.collection<Template>('template').snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Template;
          data.guid = action.payload.doc.id;
          console.log('kkk',data)
          return data ;
        });
      })

      .subscribe(res => {
        this.template = res;
        console.log('oo',this.template)
        if ( this.searchText && this.searchText !== '' )
        {
            this.template = FuseUtils.filterArrayByString(this.template, this.searchText);
        }

        this.onTemplateChanged.next(this.template);
        resolve(this.template);
      }, reject);

    });
  }

  getUserData(): any {
    //return user data
  }

  toggleSelectedTemplate(id)
  {
    if ( this.selectedTemplate.length > 0 )
    {
        const index = this.selectedTemplate.indexOf(id);

        if ( index !== -1 )
        {
            this.selectedTemplate.splice(index, 1);

            // Trigger the next event
            this.onSelectedTemplateChanged.next(this.selectedTemplate);

            // Return
            return;
        }
    }

    // If we don't have it, push as selected
    this.selectedTemplate.push(id);

    // Trigger the next event
    this.onSelectedTemplateChanged.next(this.selectedTemplate);
  }

  toggleSelectAll()
  {

  }

  selectTemplate(filterParameter?, filterValue?)
  {
    this.selectedTemplate = [];

    // If there is no filter, select all todos
    if ( filterParameter === undefined || filterValue === undefined )
    {
        this.selectedTemplate = [];
        this.template.map(template => {
            // this.selectedTemplate.push(template.id);
        });
    }
    else
    {
        /* this.selectedTemplate.push(...
             this.template.filter(todo => {
                 return todo[filterParameter] === filterValue;
             })
         );*/
    }

    // Trigger the next event
    this.onSelectedTemplateChanged.next(this.selectedTemplate);

  }

  updateTemplate(guid, template)
  {
    console.log(guid);
    console.log("updateTemplate");
    return this.tfs.doc<Template>('template/' + guid).set(template);
  }

  newTemplate(template)
  {
    // register new user and password
    // this.afAuth.auth.createUserWithEmailAndPassword(template.email, template.password).then(user => {
      console.log(template);
      console.log("firebase template add");
      this.templateCollection.add(template);
    // }).catch(error => {
    //   console.log(error);
    //   this.snackBar.open(error.message, 'OK', {
    //       verticalPosition: 'top',
    //       duration        : 10000
    //   });
    // });

  }

  updateUserData(userData)
  {

  }

  deselectTemplate()
  {
    this.selectedTemplate = [];

    // Trigger the next event
    this.onSelectedTemplateChanged.next(this.selectedTemplate);

  }

  deleteTemplate(template)
  {
    console.log(template.guid);
    return this.tfs.doc<Template>('template/' + template.guid).delete();
  }

  deleteSelectedTemplate()
  {

  }
}
