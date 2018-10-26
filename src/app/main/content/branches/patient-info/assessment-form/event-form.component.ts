import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FusePatientInfoService } from '../patient-info.service';
import { Assessment } from '../Assessment.model';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../../core/animations';

@Component({
    selector     : 'fuse-assessment-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class FuseAssessmentFormDialogComponent implements OnInit
{
    dasChart: any[];
    dialogTitle: string;
    assessmentForm: FormGroup;
    action: string;
    assessment: Assessment;
    dataSource: FileDataSource | null;
    displayColumns = ['question', 'radio'];
    depression: number;
    anxiety: number;
    stress: number;
    quest = [];

    onDasChartChangeSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<FuseAssessmentFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private patientInfoService: FusePatientInfoService,
    )
    {
        this.onDasChartChangeSubscription = 
        this.patientInfoService.onDasChanged
        .subscribe ( dasChart => {
            this.dasChart= dasChart;
        })

        this.assessment = data.assessment;
        this.action = '';

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Assessment';
             this.assessment = data.assessment;
        }
        else
        {
            this.dialogTitle = 'New Assessment';
            this.assessment = new Assessment({
                doctor_name: this.patientInfoService.patient.current_assigned_doctor
            });
        }

        this.assessmentForm = this.createEventForm();
        
    }

    ngOnInit()
    {
        this.dataSource = new FileDataSource( this.patientInfoService );
        this.depression = 0;
        this.anxiety = 0;
        this.stress = 0;

        var i;
        this.quest[0] = 0
        for (i=1;i<22;i++){
            this.quest[i] = 0;
        }
    }

    createEventForm()
    {
        var assessment = new Assessment(this.assessment);
        return this.formBuilder.group(assessment);
    }

    ngOnDestroy(){
        this.onDasChartChangeSubscription.unsubscribe();
      }

    dasScore(type,idx,target){
        this.quest[idx] = target.value;        
        
        if(type == 'depression'){
            this.depression = eval(this.quest[3]) + eval(this.quest[5]) + eval(this.quest[10]) + eval(this.quest[13]) + eval(this.quest[16]) + eval(this.quest[17]) + eval(this.quest[21]);
        }
        else if(type == 'anxiety'){
            this.anxiety = eval(this.quest[2]) + eval(this.quest[4]) + eval(this.quest[7]) + eval(this.quest[9]) + eval(this.quest[15]) + eval(this.quest[19]) + eval(this.quest[20]);
        }
        else{
            this.stress = eval(this.quest[1]) + eval(this.quest[6]) + eval(this.quest[8]) + eval(this.quest[11]) + eval(this.quest[12]) + eval(this.quest[14]) + eval(this.quest[18]);
        }
        this.patientInfoService.calculateDas(this.depression,this.anxiety,this.stress);
        
    }

}

export class FileDataSource extends DataSource<any>
{

  constructor( private patientInfoService: FusePatientInfoService){
    super();
  }

  connect(): Observable<any[]>
  {
    return this.patientInfoService.onDasChanged;
  }

  disconnect()
  {
    
  }
}