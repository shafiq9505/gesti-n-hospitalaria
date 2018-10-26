import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Question } from '../question.model';

@Component({
    selector     : 'fuse-questions-question-form-dialog',
    templateUrl  : './question-form.component.html',
    styleUrls    : ['./question-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class FuseQuestionsQuestionFormDialogComponent implements OnInit
{
    event: CalendarEvent;
    dialogTitle: string;
    questionForm: FormGroup;
    action: string;
    question: Question;

    constructor(
        public dialogRef: MatDialogRef<FuseQuestionsQuestionFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder
    )
    {
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Question\'s Set';
            this.question = data.question;
        }
        else
        {
            this.dialogTitle = 'New Question\'s Set';
            this.question = new Question({});
        }

        this.questionForm = this.createQuestionForm();
    }

    ngOnInit()
    {
    }

    createQuestionForm()
    {
        return this.formBuilder.group({
            id      : [this.question.id],
            title   : [this.question.title],
            note    : [this.question.note]
        });
    }
}
