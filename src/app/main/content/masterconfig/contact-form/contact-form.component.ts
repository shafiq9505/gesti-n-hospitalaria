import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { masterconfig } from '../contact.model';

@Component({
    selector     : 'fuse-contacts-contact-form-dialog',
    templateUrl  : './contact-form.component.html',
    styleUrls    : ['./contact-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseContactsContactFormDialogComponent implements OnInit
{
    event: CalendarEvent;
    dialogTitle: string;
    contactForm: FormGroup;
    action: string;
    contact: masterconfig;

    constructor(
        public dialogRef: MatDialogRef<FuseContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Settings Information';
            this.contact = data.contact;
        }
        else
        {
            this.dialogTitle = 'New Settings Information';
            this.contact = new masterconfig({})
        }

        this.contactForm = this.createContactForm();
    }

    ngOnInit()
    {

    }

    createContactForm()
    {
        return this.formBuilder.group({
            id  : [this.contact.id],
            reason1    : [this.contact.reason1],
            reason2 : [this.contact.reason2],
            reason3 : [this.contact.reason3],
            reason4 : [this.contact.reason4],
            category : [this.contact.category]

        });
    }
}
