import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { fuseAnimations } from '../../../../core/animations';
import { OccasionserviceService } from './../occasionservice.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FileDataSource } from '../../branches/patient-info/patient-appointment/patient-appointment.component';
import { Subscription } from 'rxjs/Subscription';
import {OccasionServiceFormComponent} from '../occasion-service-form/occasion-service-form.component'
import { FormGroup } from '@angular/forms';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-occasion-service-list',
  templateUrl: './occasion-service-list.component.html',
  styleUrls: ['./occasion-service-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OccasionServiceListComponent implements OnInit, OnDestroy {

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  displayedColumns = ['name','location', 'category', 'time', 'buttons'];
  dataSource: FilesDataSource | null;
  occassion: any;
  dialogRef: any;

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

  onOccassionChangedSubscription: Subscription;


  constructor(
    private OccasionserviceService: OccasionserviceService,
    public toastr: ToastrService,
    public dialog: MatDialog,

  ) {
    this.onOccassionChangedSubscription =
      this.OccasionserviceService.onOccassionChanged.subscribe(occassion => {
        this.occassion = occassion
      });

  }

  ngOnInit() 
  {
    this.dataSource = new FilesDataSource(this.OccasionserviceService)
  }
  ngOnDestroy() {
    this.onOccassionChangedSubscription.unsubscribe();
  }
  
  
  editOccassion(occassion) {
    this.dialogRef = this.dialog.open(OccasionServiceFormComponent, {
      panelClass: 'contact-form-dialog',
      data      : {
          occassion: occassion,
          action : 'edit'
      },
      width:'100%'
  });

  this.dialogRef.afterClosed()
      .subscribe(response => {
          if ( !response )
          {
              return;
          }
          const actionType: string = response[0];
          const formData: FormGroup = response[1];
          switch ( actionType )
          {
              /**
               * Save
               */
              case 'save':

                  this.OccasionserviceService.UpdateOccasion(formData.getRawValue());
                  this.toastr.success('Occassion data Data Successfully Updated');
                  break;
              /**
               * Delete
               */
              case 'delete':

                  this.deleteOccassion(occassion);
                  
                  break;
          }
      });

  }

  deleteOccassion(occassion)
{
  this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
    disableClose: false
});

this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

this.confirmDialogRef.afterClosed().subscribe(result => {
    if ( result )
    {
        this.OccasionserviceService.deleteOccassion(occassion);
        this.toastr.success(occassion.location +' '+ 'Is Deleted');
    }
    this.confirmDialogRef = null;
});

}
}


export class FilesDataSource extends DataSource<any>
{
  constructor(private OccasionserviceService: OccasionserviceService) {

    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<any[]> 
  {
    return this.OccasionserviceService.onOccassionChanged;
  }

  disconnect() {
  }
}


