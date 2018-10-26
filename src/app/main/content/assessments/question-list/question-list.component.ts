import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { Observable } from 'rxjs/Observable';
import { FuseQuestionsQuestionFormDialogComponent } from '../question-form/question-form.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector     : 'fuse-questions-question-list',
    templateUrl  : './question-list.component.html',
    styleUrls    : ['./question-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class FuseQuestionsQuestionListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

    questions: any;
    user: any;
    dataSource: FilesDataSource | null;
    displayedColumns = ['title', 'note', 'buttons'];
    selectedQuestions: any[];
    checkboxes: {};

    onQuestionsChangedSubscription: Subscription;
    onSelectedQuestionsChangedSubscription: Subscription;
    onUserDataChangedSubscription: Subscription;

    dialogRef: any;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private questionsService: QuestionsService,
        public dialog: MatDialog
    )
    {
        this.onQuestionsChangedSubscription =
            this.questionsService.onQuestionsChanged.subscribe(questions => {

                this.questions = questions;

                this.checkboxes = {};
                questions.map(question => {
                    this.checkboxes[question.id] = false;
                });
            });

        this.onSelectedQuestionsChangedSubscription =
            this.questionsService.onSelectedQuestionsChanged.subscribe(selectedQuestions => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedQuestions.includes(id);
                }
                this.selectedQuestions = selectedQuestions;
            });

        this.onUserDataChangedSubscription =
            this.questionsService.onUserDataChanged.subscribe(user => {
                this.user = user;
            });

    }

    ngOnInit()
    {
        this.dataSource = new FilesDataSource(this.questionsService);
    }

    ngOnDestroy()
    {
        this.onQuestionsChangedSubscription.unsubscribe();
        this.onSelectedQuestionsChangedSubscription.unsubscribe();
        this.onUserDataChangedSubscription.unsubscribe();
    }

    editQuestion(question)
    {
        this.dialogRef = this.dialog.open(FuseQuestionsQuestionFormDialogComponent, {
            panelClass: 'question-form-dialog',
            data      : {
                question: question,
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

                        this.questionsService.updateQuestion(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteQuestion(question);

                        break;
                }
            });
    }

    /**
     * Delete Question
     */
    deleteQuestion(question)
    {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this.questionsService.deleteQuestion(question);
            }
            this.confirmDialogRef = null;
        });

    }

    onSelectedChange(questionId)
    {
        this.questionsService.toggleSelectedQuestion(questionId);
    }

    toggleStar(questionId)
    {
        if ( this.user.starred.includes(questionId) )
        {
            this.user.starred.splice(this.user.starred.indexOf(questionId), 1);
        }
        else
        {
            this.user.starred.push(questionId);
        }

        this.questionsService.updateUserData(this.user);
    }
}

export class FilesDataSource extends DataSource<any>
{
    constructor(private questionsService: QuestionsService)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.questionsService.onQuestionsChanged;
    }

    disconnect()
    {
    }
}
