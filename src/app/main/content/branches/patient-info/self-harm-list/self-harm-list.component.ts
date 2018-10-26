import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from '../patient-info.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { NewSelfHarmFormComponent } from '../self-harm/self-harm.component'

@Component({
  selector: 'app-self-harm-list',
  templateUrl: './self-harm-list.component.html',
  styleUrls: ['./self-harm-list.component.scss'],
  animations: fuseAnimations
})
export class SelfHarmListComponent implements OnInit {

  selfharmLists: any[];
  selfharmlist: any
  dataSource: FileDataSource | null;
  displayColumns = ['admission data','self harm act','dischargedetails','diagnosisdetails'];
  selectedList: any[];

  onSelfHarmChangedSubscription: Subscription;
  onSelectedList: Subscription;

  dialogRef: any;
  checkboxes: {};
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  constructor(
    private patientInfoService: FusePatientInfoService,
    public dialog: MatDialog
  ) {
    this.onSelfHarmChangedSubscription =
      this.patientInfoService.onSelfHarmChanged
        .subscribe ( selfharmLists => {
          this.selfharmLists= selfharmLists;
        })
  }

  ngOnInit() {
    this.dataSource = new FileDataSource( this.patientInfoService )
  }

  ngOnDestroy(){
    this.onSelfHarmChangedSubscription.unsubscribe();
  }


  editSelfHarm(selfharm) {
    this.dialogRef = this.dialog.open(NewSelfHarmFormComponent, {
      panelClass: 'selfharm',
      data: {
        selfharm: selfharm,
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
          console.log('loct: self-harm-list.component','action: Saving Self Harm','actionType:',actionType);
          this.patientInfoService.updateSelfHarm(formData.getRawValue());
          break;

          case 'delete':
            console.log('loct: self-harm-list.component', 'action: Delete Self Harm', 'actionType:', actionType);
            this.patientInfoService.deleteSelfHarm(selfharm)
          break;

          default:
            console.log('loct: self-harm-list.component','default switch', 'actionType:', actionType);
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
    return this.patientInfoService.onSelfHarmChanged;
  }

  disconnect()
  {

  }
}
