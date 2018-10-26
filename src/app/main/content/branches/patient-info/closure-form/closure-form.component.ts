import { Component, OnDestroy, Inject, OnInit, ViewEncapsulation,  ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { Closure } from '../closure.model';
import { MatButtonModule } from '@angular/material/button';
import { FusePatientInfoService } from '../patient-info.service';
import * as moment from 'moment';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatFormFieldControl } from '@angular/material';
import {fuseAnimations} from '../../../../../core/animations';

 @Component({
   selector: 'app-closure-form',
   templateUrl: './closure-form.component.html',
   styleUrls: ['./closure-form.component.scss'],
   encapsulation: ViewEncapsulation.None,
   animations : fuseAnimations
 })
 export class ClosureFormComponent implements OnInit {

   dialogTitle: string;
   closureForm: FormGroup;
   action: string;
   closure_form: Closure;
   checklists = [
     'Review of case         ',
     'Consultation with team regarding case closure decision',
     'Referrals to other service providers as appropriate',
     'Appropriate follow up arranged',
     'Patient and/or family informed of closure',
     'Case closure documented on file'];
   disableClosure = new FormControl(false);

   constructor(
     public dialogRef: MatDialogRef<ClosureFormComponent>,
     @Inject(MAT_DIALOG_DATA) private data: any,
     private formBuilder: FormBuilder
   ) {
       this.action = data.action;

       if( this.action === 'edit' ){
         this.dialogTitle = 'Edit Closure';
         this.closure_form = data.closure;
       }
       else {
         this.dialogTitle = 'New Closure';
         this.closure_form = new Closure({});
       }
       this.closureForm = this.createClosure();
      }

   ngOnInit() {}

   createClosure(){
     return this.formBuilder.group({
       guid           : [this.closure_form.guid],
       checklist      : [this.closure_form.checklist],
       followup       : [this.closure_form.followup],
       reasonofclosure: [this.closure_form.reasonofclosure],
       comment        : [this.closure_form.comment],
       casesummary    : [this.closure_form.casesummary]
     })
   }
 }
