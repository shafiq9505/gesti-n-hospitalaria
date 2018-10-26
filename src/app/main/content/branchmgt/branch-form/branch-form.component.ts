import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Branch } from '../branch.model';

@Component({
    selector     : 'fuse-branch-branch-form-dialog',
    templateUrl  : './branch-form.component.html',
    styleUrls    : ['./branch-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseBranchBranchFormDialogComponent implements OnInit
{
    event: CalendarEvent;
    dialogTitle: string;
    branchForm: FormGroup;
    action: string;
    branch: Branch;
    states = [
      '',
      'Johor',
      'Kedah',
      'Kelantan',
      'Melaka',
      'Negeri Sembilan',
      'Pahang',
      'Perak',
      'Perlis',
      'Pulau Pinang',
      'Sabah',
      'Sarawak',
      'Selangor',
      'Terengganu',
      'W.P. Kuala Lumpur',
      'W.P. Labuan',
      'W.P. Putrajaya'
	];

    constructor(
        public dialogRef: MatDialogRef<FuseBranchBranchFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Branch';
            this.branch = data.branch;
        }
        else
        {
            this.dialogTitle = 'New Branch';
            this.branch = new Branch({});
        }

        this.branchForm = this.createBranchForm();
    }

    ngOnInit()
    {
    }

    createBranchForm()
    {
        return this.formBuilder.group({
          id        : [this.branch.id],
          name      : [this.branch.name],
          address   : [this.branch.address],
          postcode  : [this.branch.postcode],
          city      : [this.branch.city],
          state     : [this.branch.state],
          phone     : [this.branch.phone],
          faxno     : [this.branch.faxno],
          startdate : [this.branch.startdate],
          isMainBranch : [this.branch.isMainBranch]
        });
    }
}
