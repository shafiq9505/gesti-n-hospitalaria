import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Referral } from '../referral-model';
import { FusePatientInfoService } from '../patient-info.service'
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-refer-patient-dialog',
  templateUrl: './refer-patient-dialog.component.html',
  styleUrls: ['./refer-patient-dialog.component.scss']
})
export class ReferPatientDialogComponent implements OnInit {

  dialogTitle: string;
  referralForm: FormGroup;
  action:string;
  patientInfo: any[];
  referral: any[];
  referral_input: Referral;
  selectedBranch: any;
  selectedBranchDetail: any;
  externalNotBranch:boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ReferPatientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private patientInfoService: FusePatientInfoService
  ) { 
    
    this.action = data.action;

    if( this.action === 'other'){
      this.dialogTitle = 'Refer to Outside Entity';
      this.referral_input = new Referral({});
    } else {
      this.dialogTitle = 'Refer to another Branch'
      this.referral_input = new Referral({});
    }
    let referType = ( this.action === 'other' ? 'Referred(External)' : 'Referred(Internal)' );
    this.referralForm = this.createForm(referType);
    this.patientInfo = data.patient;
    this.referral = data.referral;
  }

  ngOnInit() {
  }

  createForm(referType?){
    return this.formBuilder.group({
      referralId: [this.referral_input.referralId],
      dateAdmitted: [this.referral_input.dateAdmitted],
      dateDiscard: [this.referral_input.dateDiscard],

      // doc_title: [ this.referral_input.doc_title],
      doc_name: [ this.referral_input.doc_name],
      doc_department: [ this.referral_input.doc_department],
      loct_name: [this.referral_input.loct_name],
      loct_address: [this.referral_input.loct_address],
      loct_postcode: [this.referral_input.loct_postcode],
      loct_city: [this.referral_input.loct_postcode],
      loct_state: [this.referral_input.loct_state],

      reasons: [this.referral_input.reasons],
      problems: [this.referral_input.problems],
      history: [this.referral_input.history],
      examinations: [this.referral_input.examination],
      investigation: [this.referral_input.investigation],
      summary: [this.referral_input.summary],
      comments: [this.referral_input.comments],
      pdf_referral_id: [ this.referral_input.pdf_referral_id],
      referral_type: [this.referral_input.referral_type]
    })
  }

  getSelectedBranch(){
    if(this.referral){
      let temp = this.referral.filter(
        branch => branch.id === this.selectedBranch
      );
      this.selectedBranchDetail = temp[0];
    }
  }

  calcAge( bday ){
    let date = new Date(bday);
    let ageDiff = Date.now() - date.getTime();
    let ageDate = new Date(ageDiff);
    return Math.abs( ageDate.getUTCFullYear() - 1970); 
  }
}
