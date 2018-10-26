import { Injectable } from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Contact } from '../../main/content/users/contact.model';
import { ContactsFirebaseService } from '../../main/content/users/users-firebase.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class UserLoginService implements CanActivate {

  user: Contact;

  constructor(private afAuth: AngularFireAuth, private cfs: ContactsFirebaseService, private router: Router) {
    //check if localstorage exists
    this.user = JSON.parse(localStorage.getItem('currentuser'));

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    //check if user exists
    console.log("canActivate");
    // console.log(this.user);
    if (this.user != null || this.user !== undefined){
      console.log("ok");
      return true;
    } else {
      console.log("user doesn't exist");
      this.router.navigate(['/login']);
      return false;
    }

  }


  login(username, password): Observable<any>{
    return Observable.create(observer => {
      this.afAuth.auth.signInWithEmailAndPassword(username, password)
        .then(user => {
          return this.cfs.getContact(user.email).subscribe(result => {
            if (result.length > 0){
              this.user = <Contact>result[0];
              localStorage.setItem('currentuser',JSON.stringify(this.user));
              observer.next({result: true, data: user});
            } else {
              observer.next({result: false, data: "User doesn't exist"});
            }
          });
        })
        .catch(error => {
          observer.next({result: false, data: error});
        });
    });
  }

  updateUser(uid) {
    return this.cfs.getContact(uid).subscribe(result => {
      if (result.length > 0){
        this.user = <Contact>result[0];
        // localStorage.setItem('currentuser',JSON.stringify(this.user));
        // observer.next({result: true, data: user});
      } else {
        // observer.next({result: false, data: "User doesn't exist"});
      }
    });
  }

  logout() {
    return this.afAuth.auth.signOut()
      .then(() => {
        localStorage.removeItem('currentuser');
        this.user = null;
        return true;
      })
      .catch(() => {
        return false;
      });
  }

}
