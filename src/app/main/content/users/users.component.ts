import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { ContactsService } from './users.service';
import { ContactsFirebaseService } from './users-firebase.service';
import { FuseContactsContactFormDialogComponent } from './users-form/users-form.component';
import { FirebaseService } from '../../../core/services/firebase.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {

  hasSelectedContacts: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedContactsChangedSubscription: Subscription;


  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private contactsService: ContactsService,
    public dialog: MatDialog,
    private firebaseService: FirebaseService,
    private cfs: ContactsFirebaseService
  ) {
    this.translationLoader.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
   }

  ngOnInit() {
    this.onSelectedContactsChangedSubscription =
        this.contactsService.onSelectedContactsChanged
            .subscribe(selectedContacts => {
                this.hasSelectedContacts = selectedContacts.length > 0;
            });

    this.searchInput.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe(searchText => {
            this.cfs.onSearchTextChanged.next(searchText);
        });

  }

  newContact()
  {

      this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
          panelClass: 'contact-form-dialog',
          data      : {
              action: 'new'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }
            //   console.log('receive doctor:',response.getRawValue())
            this.cfs.newContact(response.getRawValue());
          });

  }


}
