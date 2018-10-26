import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BranchUsers } from './branch-user.model';

@Component({
    selector     : 'fuse-branch-user-form-dialog',
    templateUrl  : './branch-user-form.component.html',
    styleUrls    : ['./branch-user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class BranchUserFormComponent implements OnInit
{
    dialogTitle: string;
    userForm: FormGroup;
    action: string;
    user: BranchUsers;

    constructor(
        public dialogRef: MatDialogRef<BranchUserFormComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit User';
            this.user = data.user;
        }
        else
        {
            this.dialogTitle = 'New User';
            this.user = new BranchUsers({});
        }

        this.userForm = this.createUserForm();
    }

    ngOnInit()
    {
    }

    createUserForm()
    {
        return this.formBuilder.group({
          id        : [this.user.id],
          name      : [this.user.name],
          address   : [this.user.address],
          postcode  : [this.user.postcode],
          city      : [this.user.city],
          state     : [this.user.state],
          phone     : [this.user.phone],
          faxno     : [this.user.faxno]
        });
    }
}
