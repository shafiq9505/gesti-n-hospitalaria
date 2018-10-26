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
  selector: 'patient-appointments',
  templateUrl: './patient-appointment.component.html',
  styleUrls: ['./patient-appointment.component.scss'],
  animations: fuseAnimations
})
export class PatientAppointmentComponent implements OnInit {

  appointmentCharts: any[];
  visitchat: any
  dataSource: FileDataSource | null;
  displayColumns = ['start', 'title' , 'physician'];
  selectedChart: any[];
  
  onAppointmentChartChangedSubscription: Subscription;
  onSelectedChart: Subscription;

  dialogRef: any;
  checkboxes: {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog
  ) { 
    this.onAppointmentChartChangedSubscription = 
      this.patientInfoService.onAppointmentChanged.subscribe ( appointmentCharts => {
          this.appointmentCharts= appointmentCharts;
        })
  }

  ngOnInit() {
    this.dataSource = new FileDataSource( this.patientInfoService );
    this.patientInfoService.getDoctorAppointments();
  }

  ngOnDestroy(){
   this.onAppointmentChartChangedSubscription.unsubscribe();
  }


  editVisitNote(eventData) {
    this.dialogRef = this.dialog.open(FuseCalendarEventFormDialogComponent, {
      panelClass: 'visit-note-form',
      data: {
        eventData: eventData,
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
            this.patientInfoService.deletePatientAppointment(eventData)
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
    return this.patientInfoService.onAppointmentChanged;
  }

  disconnect()
  {
    
  }
}
