import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseBranchInfoService } from './branch-info.service';
import { fuseAnimations } from '../../../../core/animations';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { Subscription } from 'rxjs/Subscription';
import { BranchInfo } from './branch-info.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { BranchUserFormComponent } from '../branch-user-form/branch-user-form.component';

@Component({
  selector     : 'fuse-branch-info',
  templateUrl  : './branch-info.component.html',
  styleUrls    : ['./branch-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class FuseBranchInfoComponent implements OnInit, OnDestroy
{
//  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  branchinfo = new BranchInfo();
  onBranchInfoChanged: Subscription;
  statusForm: FormGroup;
  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private branchinfoService: FuseBranchInfoService,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  )
  {

  }

  ngOnInit()
  {
    // Subscribe to update branchinfo on changes
    this.onBranchInfoChanged =
    this.branchinfoService.onBranchInfoChanged
    .subscribe(branchinfo => {
      this.branchinfo = new BranchInfo(branchinfo);
    });

    this.statusForm = this.formBuilder.group({
      newStatus: ['']
    });
  }

  updateStatus()
  {

    const newStatus = {};

    newStatus['name'] = this.statusForm.get('newStatus').value;

    this.branchinfo.team.unshift(newStatus);
    this.statusForm = this.formBuilder.group({
      newStatus: ['']
    });
  }

  newUser()
  {
    this.dialogRef = this.dialog.open(BranchUserFormComponent, {
      panelClass: 'branch-user-form-dialog',
      data      : {
        action: 'new'
      },
      width     : '60%'
    });

    this.dialogRef.afterClosed()
    .subscribe((response: FormGroup) => {
      if ( !response )
      {
        return;
      }

      //this.branchinfoService.updateContact(response.getRawValue());

    });

  }

  editUser(user)
  {
    this.dialogRef = this.dialog.open(BranchUserFormComponent, {
      panelClass: 'branch-user-form-dialog',
      data      : {
        user: user,
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

        //this.contactsService.updateContact(formData.getRawValue());

        break;
        /**
        * Delete
        */
        case 'delete':

        //this.deleteContact(contact);

        break;
      }
    });
  }

  /**
  * Delete Contact
  */
  deleteContact(contact)
  {
    this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });

    this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

    this.confirmDialogRef.afterClosed().subscribe(result => {
      if ( result )
      {
        //this.contactsService.deleteContact(contact);
      }
      this.confirmDialogRef = null;
    });

  }


  ngOnDestroy()
  {
    this.onBranchInfoChanged.unsubscribe();
  }
}
