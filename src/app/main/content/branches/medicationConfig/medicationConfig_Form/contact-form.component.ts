import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { medicationConfig } from '../contact.model';
import {ToastrService} from 'ngx-toastr';
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
    contact: medicationConfig;

    constructor(
        public dialogRef: MatDialogRef<FuseContactsContactFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        public toastr : ToastrService
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Medication Data Information';
            this.contact = data.contact;
        }
        else
        {
            this.dialogTitle = 'New Medication Data  Information';
            this.contact = new medicationConfig({})
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
            name : [this.contact.name],
            route : [this.contact.route]
        });
    }
}
