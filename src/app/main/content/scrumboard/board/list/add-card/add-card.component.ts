import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { SubjectiveQuestion } from '../../../questiontypes/question-subjective';

@Component({
    selector   : 'fuse-scrumboard-board-add-card',
    templateUrl: './add-card.component.html',
    styleUrls  : ['./add-card.component.scss']
})
export class FuseScrumboardBoardAddCardComponent implements OnInit
{
    formActive = false;
    formActiveSubjective = false;
    formActiveMultipleChoice = false;
    formActiveScale = false;
    formActiveCheckbox = false;

    form: FormGroup;
    @Output() onCardAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;

    QuestionTypes = [
        {value: 'subjective', viewValue: 'Subjective'},
        {value: 'multiplechoice', viewValue: 'Multiple Choice'},
        {value: 'checkbox', viewValue: 'Checkboxes'},
        {value: 'scale', viewValue: 'Scale'}
      ];

    questiontype: string;

    constructor(
        private formBuilder: FormBuilder
    )
    {
      let q = new SubjectiveQuestion(
        {
          key: 's',
          label : 'Apakah nama anda?'
        }
      );
      console.log(q);
    }

    ngOnInit()
    {
    }

    get name() {
      return this.form.get('name');
    }

    get itemRows(): FormArray {
      return this.form.get('itemRows') as FormArray;
    }

    initItemRows(){
      return this.formBuilder.group({
        itemname: new FormControl('', [
                    Validators.required,
                    Validators.minLength(4)]
                  ),
        score: 0
      });
    }

    debug(){
      // console.log(this.form.itemRows);
    }

    addNewRow() {
      // control refers to your formarray
      const control = <FormArray>this.form.controls['itemRows'];
      // add new formgroup
      control.push(this.initItemRows());
    }

    deleteRow(index: number) {
      // control refers to your formarray
      const control = <FormArray>this.form.controls['itemRows'];
      // remove the chosen row
      control.removeAt(index);
    }

    openForm()
    {
        console.log(this.questiontype);

        switch(this.questiontype){
          case 'subjective':
            this.formActive = true;
            this.formActiveSubjective = true;

            this.form = this.formBuilder.group({
                name: new FormControl('', [Validators.required, Validators.minLength(2)]),
            });
            break;
          case 'multiplechoice':
            this.formActive = true;
            this.formActiveMultipleChoice = true;

            this.form = this.formBuilder.group({
                name: new FormControl('', [Validators.required, Validators.minLength(2)]),
                itemRows: this.formBuilder.array([this.initItemRows()])
            });
            break;
          case 'checkbox':
            this.formActive = true;
            this.formActiveCheckbox = true;
            this.form = this.formBuilder.group({
                name: new FormControl('', [Validators.required, Validators.minLength(2)]),
                itemRows: this.formBuilder.array([this.initItemRows()])
            });
            break;
          case 'scale':
            this.formActive = true;
            this.formActiveScale = true;
            this.form = this.formBuilder.group({
                name: new FormControl('', [Validators.required, Validators.minLength(2)]),
                itemRows: this.formBuilder.array([this.initItemRows()])
            });
            break;
        }

        this.focusNameField();
    }

    closeForm(questiontype)
    {
        console.log(questiontype);

        switch (questiontype){
          case 'subjective':
            this.formActive = false;
            this.formActiveSubjective = false;
            break;
          case 'multiplechoice':
            console.log("mchoice");
            this.formActive = false;
            this.formActiveMultipleChoice = false;

            break;
          case 'checkbox':
            this.formActive = false;
            this.formActiveCheckbox = false;
            break;
          case 'scale':
            this.formActive = false;
            this.formActiveScale = false;
            break;
        }

    }

    focusNameField()
    {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    onFormSubmit(type)
    {
        console.log("onFormSubmit");
        if ( this.form.valid )
        {
            const cardName = this.form.getRawValue().name;
            console.log(this.form.getRawValue());
            this.onCardAdd.next({name: this.form.getRawValue().name, itemRows: this.form.getRawValue().itemRows, type: this.questiontype});
            this.closeForm(this.questiontype);
        }
    }
}
