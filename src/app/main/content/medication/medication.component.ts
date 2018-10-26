import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ContactsService } from './medication.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { FuseContactsContactFormDialogComponent } from './medication-form/medication-form.component';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { MedicationFirebaseService } from './medication-firebase.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'fuse-contacts',
    templateUrl: './contacts.component.html',
    styleUrls: ['./contacts.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class FuseContactsComponent implements OnInit, OnDestroy {
    hasSelectedContacts: boolean;
    searchInput: FormControl;
    dialogRef: any;
    onSelectedContactsChangedSubscription: Subscription;

    constructor(
        private contactsService: ContactsService,
        public dialog: MatDialog,
        public toastr: ToastrService
    ) {
        this.searchInput = new FormControl('');
    }

    newContact() {
        this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data: {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup) => {
                if (!response) {
                    return;
                }

                this.contactsService.updateContact(response.getRawValue(), response.getRawValue());
                this.toastr.success('New Medication Data Inserted')
            });

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
                this.contactsService.onSearchTextChanged.next(searchText);
            });
    }

    ngOnDestroy() {
        this.onSelectedContactsChangedSubscription.unsubscribe();
    }
}
