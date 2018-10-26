import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BranchService } from '../branch.service';
import { Observable } from 'rxjs/Observable';
import { FuseBranchBranchFormDialogComponent } from '../branch-form/branch-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector     : 'fuse-branch-branch-list',
    templateUrl  : './branch-list.component.html',
    styleUrls    : ['./branch-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseBranchBranchListComponent implements OnInit {

    branch: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['name', 'address', 'phone', 'fax', 'buttons'];
    selectedBranch: any[];
    checkboxes: {};

    onBranchChangedSubscription: Subscription;
    onSelectedBranchChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private bfs: BranchService,
        public dialog: MatDialog
    )
    {
        this.onBranchChangedSubscription =
            this.bfs.onBranchChanged.subscribe(branch => {
              this.branch = branch;
                this.checkboxes = {};
                branch.map(branch => {
                    this.checkboxes[branch.id] = false;
                });
            });

        this.onSelectedBranchChangedSubscription =
            this.bfs.onSelectedBranchChanged.subscribe(selectedBranch => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedBranch.includes(id);
                }
                this.selectedBranch = selectedBranch;
            });

        this.onUserDataChangedSubscription =
            this.bfs.onUserDataChanged.subscribe(user => {
                this.user = user;
            });

    }

    ngOnInit()
    {
        this.dataSource = new FilesDataSource(this.bfs);
    }

    onSelectedChange(branchId)
    {
      this.bfs.toggleSelectedBranch(branchId);
    }


    editBranch(branch)
    {
      console.log(branch)
        this.dialogRef = this.dialog.open(FuseBranchBranchFormDialogComponent, {
            panelClass: 'branch-form-dialog',
            data      : {
                branch: branch,
                action : 'edit'
            },
            width: '60%'
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

                        this.bfs.updateBranch(branch.guid, formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteBranch(branch);

                        break;
                }
            });
    }

    /**
     * Delete Branch
     */
    deleteBranch(branch)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                // console.log('branch',branch);
                this.bfs.deleteBranch(branch);
            }
            this.confirmDialogRef = null;
        });

    }


}

export class FilesDataSource extends DataSource<any>
{
    constructor(private bfs: BranchService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.bfs.onBranchChanged;
    }

    disconnect()
    {
    }
}
