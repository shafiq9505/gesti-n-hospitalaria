import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from '../patient-info.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { NewVisitNoteFormComponent } from '../visit-note-form/visit-note-form.component'
import { ActivatedRoute } from '@angular/router';
import {FusePatientInfoComponent} from '../patient-info.component'
import {Visit} from '../visit.model'
import {OccassionService} from '../occassionService.model'
@Component({
  selector: 'app-visit-notes-list',
  templateUrl: './visit-notes-list.component.html',
  styleUrls: ['./visit-notes-list.component.scss'],
  animations: fuseAnimations
})
export class VisitNotesListComponent implements OnInit {

  visitCharts: any[];
  visitchart: any
  dataSource: FileDataSource | null;
  displayColumns = ['date','bp', 'weight','height','visittext'];
  selectedChart: any[];
  visitnote : Visit;
  occassion : OccassionService

  onVisitChartChangedSubscription: Subscription;
  onSelectedChart: Subscription;

  dialogRef: any;
  checkboxes: {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  patientName: String;
  Date : String;

  constructor(
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private FusePatientInfoComponent : FusePatientInfoComponent,
   
 
  ) {
    this.onVisitChartChangedSubscription =
      this.patientInfoService.onVisitNotesChanged
        .subscribe ( visitCharts => {
          this.visitCharts= visitCharts;
        })

    
  }

  ngOnInit() {
    this.dataSource = new FileDataSource( this.patientInfoService);
    this.patientName = this.FusePatientInfoComponent.returnPatientName()
   
   
  }

  ngOnDestroy(){
    this.onVisitChartChangedSubscription.unsubscribe();
   
  }


  editVisitNote(visitNote) {
    this.dialogRef = this.dialog.open(NewVisitNoteFormComponent, {
      panelClass: 'visit-note-form',
      data: {
        visitNote: visitNote,
        patient : this.patientName,
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
          
          this.patientInfoService.updateVisitNote(formData.getRawValue());
          break;

          case 'delete':
            this.patientInfoService.deleteVisitNote(visitNote)
          break;

          default:
          
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
    return this.patientInfoService.onVisitNotesChanged;
  }

  disconnect()
  {

  }
}
