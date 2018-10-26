import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';

export interface Item { id: string; name: string; }

export interface Contact {
    id: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
}

@Injectable()
export class FirebaseService {
  private itemsCollection: AngularFirestoreCollection<Item>;
  private contactsCollection: AngularFirestoreCollection<Contact>;
  items: Observable<Item[]>;

  constructor(private readonly afs: AngularFirestore, public afAuth: AngularFireAuth) {
    this.itemsCollection = afs.collection<Item>('items');
    this.contactsCollection = afs.collection<Contact>('contacts');
    this.items = this.itemsCollection.valueChanges();
  }

  addItem(name: string) {
    // Persist a document id
    const id = this.afs.createId();
    const item: Item = { id, name };
    this.itemsCollection.add(item);
  }

  addContact(contact){
    // const contact_item: C;
    this.contactsCollection.add(contact);
  }

  login(email, password) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => console.log('success'))
      .catch(error => {
        console.log(error);
      });
  }

  logout() {

  }
}
