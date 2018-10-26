import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { SelfHarm } from '../selfharm.model';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-self-harm-form',
  templateUrl: './self-harm.component.html',
  styleUrls: ['./self-harm.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NewSelfHarmFormComponent implements OnInit {

  dialogTitle: string;
  selfharmForm: FormGroup;
  action: string;
  self_harm: SelfHarm;

  constructor(
    public dialogRef: MatDialogRef<NewSelfHarmFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder
  ) {
      this.action = data.action;

      if( this.action === 'edit' ){
        this.dialogTitle = 'Edit Self Harm';
        this.self_harm = data.selfharm;
      }
      else {
        this.dialogTitle = 'New Self Harm';
        this.self_harm = new SelfHarm({});
      }

      this.selfharmForm = this.createSelfHarm();
     }

  ngOnInit() {
  }

  createSelfHarm(){
    return this.formBuilder.group({
      guid         :         [this.self_harm.guid],
      admitward    :         [this.self_harm.admitward],
      wardname     :         [this.self_harm.wardname],
      dateadmit    :         [this.self_harm.dateadmit],
      timeadmit    :         [this.self_harm.timeadmit],
      arrivalmode  :         [this.self_harm.arrivalmode],
      dateact      :         [this.self_harm.dateact],
      timeact      :         [this.self_harm.timeact],
      occurance    :         [this.self_harm.occurance],
      method       :         [this.self_harm.method],
      poisonsname  :         [this.self_harm.poisonsname],
      medicinename :         [this.self_harm.medicinename],
      othermedname :         [this.self_harm.othermedname],
      //othermedname1:         [this.registry_record.othermedname1],
      expression   :         [this.self_harm.expression],
      othersmode   :         [this.self_harm.othersmode],
      suicidal     :         [this.self_harm.suicidal],
      impulsive    :         [this.self_harm.impulsive],
      accidential  :         [this.self_harm.accidential],
      disability   :         [this.self_harm.disability],
      final        :         [this.self_harm.final],
      consequences :         [this.self_harm.consequences],
      otherward    :         [this.self_harm.otherward],
      preattempt   :         [this.self_harm.preattempt],
      attempt      :         [this.self_harm.attempt],
      illness      :         [this.self_harm.illness],
      diagnoseill  :         [this.self_harm.diagnoseill],
      treatment    :         [this.self_harm.treatment],
      lifeevents   :         [this.self_harm.lifeevents],
      otherlife    :         [this.self_harm.otherlife],
      sexualabuse  :         [this.self_harm.sexualabuse],
      datedischarge:         [this.self_harm.datedischarge],
      wardday      :         [this.self_harm.wardday],
      maindiagnosis:         [this.self_harm.maindiagnosis],
      external     :         [this.self_harm.external],
      othermx      :         [this.self_harm.othermx],
      support      :         [this.self_harm.support],
      othersupport :         [this.self_harm.othersupport],
      therapy      :         [this.self_harm.therapy],
      othertherapy :         [this.self_harm.othertherapy],
      //status       :         [this.self_harm.status],
    })
  }
}
