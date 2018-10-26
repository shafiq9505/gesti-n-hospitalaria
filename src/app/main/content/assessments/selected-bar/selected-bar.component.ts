import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector   : 'fuse-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class FuseQuestionsSelectedBarComponent implements OnInit
{
    selectedQuestions: string[];
    hasSelectedQuestions: boolean;
    isIndeterminate: boolean;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private questionsService: QuestionsService,
        public dialog: MatDialog
    )
    {
        this.questionsService.onSelectedQuestionsChanged
            .subscribe(selectedQuestions => {
                this.selectedQuestions = selectedQuestions;
                setTimeout(() => {
                    this.hasSelectedQuestions = selectedQuestions.length > 0;
                    this.isIndeterminate = (selectedQuestions.length !== this.questionsService.questions.length && selectedQuestions.length > 0);
                }, 0);
            });

    }

    ngOnInit()
    {
    }

    selectAll()
    {
        this.questionsService.selectQuestions();
    }

    deselectAll()
    {
        this.questionsService.deselectQuestions();
    }

    deleteSelectedQuestions()
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected questions?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.questionsService.deleteSelectedQuestions();
            }
            this.confirmDialogRef = null;
        });
    }

}
