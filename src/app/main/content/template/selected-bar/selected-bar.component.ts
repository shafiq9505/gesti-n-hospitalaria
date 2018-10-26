import { Component, OnInit } from '@angular/core';
import { TemplateService } from '../template.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'fuse-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class FuseTemplateSelectedBarComponent implements OnInit
{
    selectedTemplate: string[];
    hasSelectedTemplate: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private templateService: TemplateService,
        public dialog: MatDialog
    )
    {
        this.templateService.onSelectedTemplateChanged
            .subscribe(selectedTemplate => {
                this.selectedTemplate = selectedTemplate;
                setTimeout(() => {
                    this.hasSelectedTemplate = selectedTemplate.length > 0;
                    this.isIndeterminate = (selectedTemplate.length !== this.templateService.template.length && selectedTemplate.length > 0);
                }, 0);
            });

    }

    ngOnInit()
    {
    }

    selectAll()
    {
        this.templateService.selectTemplate();
    }

    deselectAll()
    {
        this.templateService.deselectTemplate();
    }

    deleteSelectedTemplate()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected template?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.templateService.deleteSelectedTemplate();
            }
            this.confirmDialogRef = null;
        });
    }

}
