import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Template } from '../template.model';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';


@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class FuseTemplateTemplateFormDialogComponent implements OnInit {
  event: CalendarEvent;
  dialogTitle: string;
  templateForm: FormGroup;
  action: string;
  template: Template;




  constructor(
    public dialogRef: MatDialogRef<FuseTemplateTemplateFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
  ) {
    this.action = data.action;

    if ( this.action === 'edit' )
    {
        this.dialogTitle = 'Edit Template';
        this.template = data.template;
    }
    else
    {
        this.dialogTitle = 'New Template';
        this.template = new Template({});
    }

    this.templateForm = this.createTemplateForm();
}

ngOnInit()
{
}

createTemplateForm()
{
    return this.formBuilder.group({
        title       : [this.template.title],
        text        : [this.template.text],
        category    : [this.template.category]
    });
}


}
