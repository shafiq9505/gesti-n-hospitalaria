import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { HttpClient } from '@angular/common/http';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatSnackBar } from '@angular/material';
import { CalendarEventModel } from './event.model';
import { FuseUtils } from '../../../core/fuseUtils';

@Injectable()
export class CalendarService implements Resolve<any>
{
    events: any;
    onEventsUpdated = new Subject<any>();

    constructor(
        private http: HttpClient,
        private readonly afs: AngularFirestore,
        public afAuth: AngularFireAuth,
        public snackBar: MatSnackBar
    )
    {

    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getEvents()
            ]).then(
                ([events]: [any]) => {
                    resolve();
                },
                reject
            );
        });
    }

    getEvents()
    {
        return new Promise((resolve, reject) => {
            
            //this.http.get('api/calendar/events')
            this.afs.collection<CalendarEventModel>('calendar').snapshotChanges().map(actions => {
                return actions.map(action => {
                  const data = action.payload.doc.data() as CalendarEventModel;
                  const guid = action.payload.doc.id;
                  return { guid, ...data };
                });
              })
                .subscribe((response: any) => {
                    this.events = response;
                    this.onEventsUpdated.next(this.events);
                    resolve(this.events);
                }, reject);
        });
    }

    updateEvents(events)
    {
        console.log('Error in update events');
        return new Promise((resolve, reject) => {
            this.http.post('api/calendar/events', {
                id  : 'events',
                data: [...events]
            })
                .subscribe((response: any) => {
                    this.getEvents();
                }, reject);
        });
    }
    addEvent(event :CalendarEventModel){
        event.guid = FuseUtils.generateGUID();
        return this.afs.doc<CalendarEventModel>('calendar/' + event.guid).set(event);
    }

    deleteEvent(event){
        
        let del = this.afs.doc('calendar/' + event.guid);
     
        return del.delete()
        .then(function () {
            console.log('Delete: true');
        })
        .catch(function (err) {
            console.error("Delete: false, status:", err)
        });
    }

    editEvent(event){
        
        let edit = this.afs.doc('calendar/' + event.guid);
     
        return edit.update(event)
        .then(function () {
            console.log('Update: true');
        })
        .catch(function (err) {
            console.error("Update: false, status:", err)
        });
    }

}
