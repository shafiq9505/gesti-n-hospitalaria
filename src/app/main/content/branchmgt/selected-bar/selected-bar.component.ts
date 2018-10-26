import { Component, OnInit } from '@angular/core';
import { BranchService } from '../branch.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'fuse-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class FuseBranchSelectedBarComponent implements OnInit
{
    selectedBranch: string[];
    hasSelectedBranch: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private branchService: BranchService,
        public dialog: MatDialog
    )
    {
        this.branchService.onSelectedBranchChanged
            .subscribe(selectedBranch => {
                this.selectedBranch = selectedBranch;
                setTimeout(() => {
                    this.hasSelectedBranch = selectedBranch.length > 0;
                    this.isIndeterminate = (selectedBranch.length !== this.branchService.branch.length && selectedBranch.length > 0);
                }, 0);
            });

    }

    ngOnInit()
    {
    }

    selectAll()
    {
        this.branchService.selectBranch();
    }

    deselectAll()
    {
        this.branchService.deselectBranch();
    }

    deleteSelectedBranch()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected branch?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.branchService.deleteSelectedBranch();
            }
            this.confirmDialogRef = null;
        });
    }

}
