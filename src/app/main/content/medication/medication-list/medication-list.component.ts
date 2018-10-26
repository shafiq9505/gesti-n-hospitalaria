import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { ContactsService } from '../medication.service';
import { Observable } from 'rxjs/Observable';
import { FuseContactsContactFormDialogComponent } from '../medication-form/medication-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import {ToastrService} from 'ngx-toastr'
@Component({
    selector     : 'fuse-contacts-contact-list',
    templateUrl  : './medication-list.component.html',
    styleUrls    : ['./medication-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseContactsContactListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    medication: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['PatientName','medname', 'date','doctorName', 'buttons'];
    selectedContacts: any[];
    checkboxes: {};

    onContactsChangedSubscription: Subscription;
    onSelectedContactsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private medicationsService: ContactsService,
        public dialog: MatDialog,
        public toastr : ToastrService
    )
    {
        this.onContactsChangedSubscription =
            this.medicationsService.onContactsChanged.subscribe(meds => {

                this.medication = meds;
                this.checkboxes = {};
                meds.map(contact => {
                    this.checkboxes[contact.id] = false;
                });

            });

        this.onSelectedContactsChangedSubscription =
            this.medicationsService.onSelectedContactsChanged.subscribe(selectedContacts => {
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

        this.onUserDataChangedSubscription =
            this.medicationsService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });

    }

    ngOnInit()
    {
        this.dataSource = new FilesDataSource(this.medicationsService);
    }

    ngOnDestroy()
    {
        this.onContactsChangedSubscription.unsubscribe();
        this.onSelectedContactsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    editContact(medication)
    {
        this.dialogRef = this.dialog.open(FuseContactsContactFormDialogComponent, {
            panelClass: 'contact-form-dialog',
            data      : {
                contact: medication,
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
                        this.medicationsService.updateContact(medication.id,formData.getRawValue());
                        this.toastr.success('Save succesfully');
                        break;
                    /**
                     * Delete
                     */
                    case 'delete':
                        this.deleteMedication(medication);
                        break;
                }
            });
    }

    /**
     * Delete Contact
     */
    deleteMedication(medication)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.medicationsService.deleteContact(medication);
                this.toastr.success(medication.name + ' ' + ' Was Delete succesfully');
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(contactId)
    {
        this.medicationsService.toggleSelectedContact(contactId);
    }

    toggleStar(contactId)
    {
        if ( this.user.starred.includes(contactId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        }
        else
        {
            this.user.starred.push(contactId);
        }       
    }

    convertDate(date){
        if(date === null){
            return
        }
        let temp = new Date(date);
        let day = temp.getDate();
        let month = temp.getMonth();
        let year = temp.getFullYear();
        return (day > 10 ? day : '0' + day) + '/' + (month > 10 ? month : '0' + month) +'/'+year;
    }
}

export class FilesDataSource extends DataSource<any>
{
    constructor(private medicationsService: ContactsService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.medicationsService.onContactsChanged;
    }

    disconnect()
    {
    }
}
