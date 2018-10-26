import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Contact } from '../contact.model';
import { BranchService } from '../../branchmgt/branch.service';
import { Subscription } from 'rxjs/Subscription';
import { ContactsFirebaseService } from '../users-firebase.service';

@Component({
    selector     : 'fuse-contacts-contact-form-dialog',
    templateUrl  : './users-form.component.html',
    styleUrls    : ['./users-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseContactsContactFormDialogComponent implements OnInit {
    event: CalendarEvent;
    dialogTitle: string;
    contactForm: FormGroup;
    action: string;
    contact: Contact;
    branchs: any;
    branchName: String = '';

    onBranchChanged: Subscription;

    constructor(
        public dialogRef: MatDialogRef<FuseContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private bfs: BranchService,
        private cfs: ContactsFirebaseService,
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit User';
            this.contact = data.contact;
            this.branchName = data.contact.branch;
        }
        else
        {
            this.dialogTitle = 'New User';
            this.contact = new Contact({});
        }

        this.contactForm = this.createContactForm();
    }

    ngOnInit()
    {
      this.onBranchChanged =
            this.cfs.onBranchChanged.subscribe(branch => {
                this.branchs = branch;
            });
    }

    createContactForm()
    {
        return this.formBuilder.group({
            id      : [this.contact.id],
            guid    : [this.contact.guid],
            name    : [this.contact.name],
            lastName: [this.contact.lastName],
            avatar  : [this.contact.avatar],
            nickname: [this.contact.nickname],
            company : [this.contact.company],
            jobTitle: [this.contact.jobTitle],
            email   : [this.contact.email],
            password: [this.contact.password],
            phone   : [this.contact.phone],
            address : [this.contact.address],
            birthday: [this.contact.birthday],
            notes   : [this.contact.notes],
            role    : [this.contact.role],
            branch  : [this.contact.branch],
            branchGUID : [this.contact.branchGUID],
            doctorType : [this.contact.doctorType],
            created : [this.contact.created]
        });
    }

    getBranch(guid) 
    {
        if(guid === null)
        {
            console.error('Err: guid null/undefined') 
            return 
        }
        this.branchs.forEach(branch => {
            if(branch.guid === guid){
                this.branchName = branch.name
            }
        });
    }
}
