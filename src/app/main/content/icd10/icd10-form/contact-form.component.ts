import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { icd10 } from '../contact.model';

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
    contact: icd10;

    constructor(
        public dialogRef: MatDialogRef<FuseContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Icd10 Data';
            this.contact = data.contact;
        }
        else
        {
            this.dialogTitle = 'New Medication Information';
            this.contact = new icd10({})
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
            code    : [this.contact.code],
            classification : [this.contact.classification],
            category : [this.contact.category]
            
           
        });
    }
}
