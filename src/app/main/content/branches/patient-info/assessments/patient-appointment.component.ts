import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from '../patient-info.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FuseCalendarEventFormDialogComponent } from '../event-form/event-form.component'

@Component({
  selector: 'patient-assessments',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.scss'],
  animations: fuseAnimations
})
export class PatientAssessmentsComponent implements OnInit {

  assessmentChart: any[];
  visitchat: any
  dataSource: FileDataSource | null;
  displayColumns = ['when',  'type' , 'physician','score' ];
  selectedChart: any[];
  
  onAssessmentChartChangeSubscription: Subscription;
  onSelectedChart: Subscription;

  dialogRef: any;
  checkboxes: {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog
  ) { 
    this.onAssessmentChartChangeSubscription = 
      this.patientInfoService.onAssessmentChanged
        .subscribe ( assessmentChart => {
          this.assessmentChart= assessmentChart;
        })
  }

  ngOnInit() {
    this.dataSource = new FileDataSource( this.patientInfoService );
  }

  ngOnDestroy(){
    this.onAssessmentChartChangeSubscription.unsubscribe();
  }


  editVisitNote(visitNote) {
    this.dialogRef = this.dialog.open(FuseCalendarEventFormDialogComponent, {
      panelClass: 'visit-note-form',
      data: {
        visitNote: visitNote,
        action : 'edit'
      },
      width: '100%'
    });

    this.dialogRef.afterClosed()
      .subscribe(response => {
        
        if(!response) {
          return;
        }

        const actionType: string = response[0];
        const formData:FormGroup = response[1];

        switch (actionType) {
          case 'save':
          console.log('loct: visit-notes-list.component','action: Saving visit note','actionType:',actionType);
          this.patientInfoService.updatePatientAppointment(formData.getRawValue());
          break;
        
          case 'delete':
            console.log('loct: visit-notes-list.component', 'action: Delete visit note', 'actionType:', actionType);
            this.patientInfoService.deletePatientAppointment(visitNote)
          break;

          default:
            console.log('loct: visit-notes-list.component','default switch', 'actionType:', actionType);
          break
        }
      })
  }
}

export class FileDataSource extends DataSource<any>
{

  constructor( private patientInfoService: FusePatientInfoService){
    super();
  }

  connect(): Observable<any[]>
  {
    return this.patientInfoService.onAssessmentChanged;
  }

  disconnect()
  {
    
  }
}
