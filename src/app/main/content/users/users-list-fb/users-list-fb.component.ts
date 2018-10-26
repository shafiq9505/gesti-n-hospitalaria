import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContactsFirebaseService } from '../users-firebase.service';
import { fuseAnimations } from '../../../../core/animations';
import { DataSource } from '@angular/cdk/collections';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { FuseContactsContactFormDialogComponent } from '../users-form/users-form.component';

@Component({
  selector: 'app-contact-list-fb',
  templateUrl: './users-list-fb.component.html',
  styleUrls: ['./users-list-fb.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class ContactListFbComponent implements OnInit {

  contacts: any;
  user: any;
  dataSource: FilesDataSource | null;
  displayedColumns = ['checkbox', 'name', 'email', 'role', 'branch'];
  selectedContacts: any[];
  checkboxes: {};

  onContactsChangedSubscription: Subscription;
  onSelectedContactsChangedSubscription: Subscription;
  onUserDataChangedSubscription: Subscription;

  dialogRef: any;

  constructor(
    private cfs: ContactsFirebaseService,
    public dialog: MatDialog
  ) {
    this.onContactsChangedSubscription = this.cfs.onContactsChanged.subscribe(contacts => {
      this.contacts = contacts;
      
      this.checkboxes = {};
      contacts.map(contact => {
        this.checkboxes[contact.id] = false;
      });
    });

    this.onSelectedContactsChangedSubscription =
        this.cfs.onSelectedContactsChanged.subscribe(selectedContacts => {
            for ( const id in this.checkboxes )
            {
                if ( !this.checkboxes.hasOwnProperty(id) )
                {
                    continue;
                }

                this.checkboxes[id] = selectedContacts.includes(id);
            }
            this.selectedContacts = selectedContacts;
        });

  }

  ngOnInit() {
    this.dataSource = new FilesDataSource(this.cfs);
  }

  onSelectedChange(contactId)
  {
      this.cfs.toggleSelectedContact(contactId);
  }

  editContact(contact)
  {
    //   console.log(contact);
      this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
          panelClass: 'contact-form-dialog',
          data      : {
              contact: contact,
              action : 'edit'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe(response => {
              if ( !response )
              {
                  return;
              }
              const actionType: string = response[0];
              const formData: FormGroup = response[1];
              switch ( actionType )
              {
                  /**
                   * Save
                   */
                  case 'save':
                      this.cfs.updateContact(contact.guid, formData.getRawValue());

                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteContact(contact);

                      break;
              }
          });
  }

  deleteContact(contact){
    this.cfs.deleteContact(contact);
  }

}

export class FilesDataSource extends DataSource<any>
{
    constructor(private cfs: ContactsFirebaseService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.cfs.onContactsChanged;
    }

    disconnect()
    {
    }
}
