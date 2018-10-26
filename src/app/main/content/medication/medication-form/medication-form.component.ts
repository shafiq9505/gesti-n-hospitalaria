import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { medication } from '../medication.model';
import {ToastrService} from 'ngx-toastr'
@Component({
    selector     : 'fuse-contacts-contact-form-dialog',
    templateUrl  : './medication-form.component.html',
    styleUrls    : ['./medication-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseContactsContactFormDialogComponent implements OnInit
{
    event: CalendarEvent;
    dialogTitle: string;
    medForm: FormGroup;
    action: string;
    med: medication;
    currentuser: any;
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
            this.dialogTitle = 'Edit Medication Information';
            this.med = data.contact;
        }
        else
        {
            this.dialogTitle = 'New Medication Information';
            this.med = new medication({})
        }

        this.medForm = this.createContactForm();
        console.log(this.medForm);
    }

    ngOnInit()
    {
        
    }

    createContactForm()
    {
        return this.formBuilder.group({
            id  : [this.med.id],
            name    : [this.med.name],
            dosage : [this.med.dosage],
            duration : [this.med.duration],
            duration_unit : [this.med.duration_unit],
            frequency : [this.med.frequency],
            route : [this.med.route],
            patientName : [this.med.patientName],
            date: [this.med.date],
            doctorName: [this.med.doctorName]
        });

      
    }
}
