import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CalendarEventModel } from '../../../calendar/event.model';
import { MatColors } from '../../../../../core/matColors';
import { FusePatientInfoService } from '../patient-info.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { fuseAnimations } from '../../../../../core/animations';

@Component({
    selector     : 'fuse-calendar-event-form-dialog',
    templateUrl  : './event-form.component.html',
    styleUrls    : ['./event-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})

export class FuseCalendarEventFormDialogComponent implements OnInit
{
    dasChart: any[];
    dialogTitle: string;
    eventForm: FormGroup;
    action: string;
    event: CalendarEvent;
    presetColors = MatColors.presets;
    start: number;
    end: number;
    displayColumns = ['appoint'];
    dataSource: FileDataSource | null;

    onDocAppointmentChangeSubscription: Subscription;

    constructor(
        public dialogRef: MatDialogRef<FuseCalendarEventFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        private formBuilder: FormBuilder,
        private patientInfoService: FusePatientInfoService,
    )
    {
        this.onDocAppointmentChangeSubscription = 
        this.patientInfoService.onDasChanged
        .subscribe ( dasChart => {
            this.dasChart= dasChart;
        })


        this.event = data.event;
        this.action = data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Appointment';
             this.event = data.eventData;
        }
        else
        {
            this.dialogTitle = 'New Appointment';
            this.event = new CalendarEventModel({
                start: data.date,
                end  : data.date,
                doctor: this.patientInfoService.patient.current_assigned_doctor
            });
        }

        this.eventForm = this.createEventForm();
    }

    ngOnInit()
    {
        this.dataSource = new FileDataSource( this.patientInfoService );
        console.log('datasource', this.dataSource);
        console.log('Dr ID ', this.patientInfoService.patient.doctorid);
        this.start = 0;
        this.end = 0;
    }

    createEventForm()
    {
        var event = new CalendarEventModel(this.event);
        return this.formBuilder.group(event);
    }

    setHour(sesi,target){
        
        if(sesi == 'start'){
            if(target.value == 'pm'){
                this.start = 12;
            }
        }
        else{
            if(target.value == 'pm'){
                this.end = 12;
            }
        }
        this.patientInfoService.setAppointmentHour(this.start,this.end);
    }

    ngOnDestroy(){
        this.onDocAppointmentChangeSubscription.unsubscribe();
      }
}

export class FileDataSource extends DataSource<any>
{

  constructor( private patientInfoService: FusePatientInfoService){
    super();
  }

  connect(): Observable<any[]>
  {
    return this.patientInfoService.onDoctorAppointmentChanged;
  }

  disconnect()
  {
    
  }
}