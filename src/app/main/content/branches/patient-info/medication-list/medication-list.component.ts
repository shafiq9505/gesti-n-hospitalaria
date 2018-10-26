import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ToastrService } from 'ngx-toastr'
import { FusePatientInfoService } from '../patient-info.service'
import { MedicationFormComponent} from '../medication-form/medication-form.component'
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import {NewVisitNoteFormComponent} from '../visit-note-form/visit-note-form.component'
import {ServiceVisitNode} from '../visit-service.service';


@Component({
  selector: 'app-medication-list',
  templateUrl: './medication-list.component.html',
  styleUrls: ['./medication-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class MedicationListComponent implements OnInit,OnDestroy {
  
  @Input() isEdit:boolean;
  @Input() medList:any;
  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;

  medication : any;
  dataSource: FileDataSource | null;

  displayedColumns = ['medname', 'dosage', 'duration', 'frequency', 'buttons'];
  selectedMedications: any[];

  onMedicationsChangedSubscriptions : Subscription;
  onSelectedMedicationChangedSubscription : Subscription;

  visitnoteId : string;
  dialogRef: any;
  action : string;
  patientName : string;
  date : string

  confirmDialogRef : MatDialogRef<FuseConfirmDialogComponent>;
 
  constructor(
    private patientService : FusePatientInfoService  ,
    public dialog: MatDialog,
    public toastr : ToastrService,
    public visit_note : NewVisitNoteFormComponent,
    public visit_service : ServiceVisitNode,

  ) {
      this.onMedicationsChangedSubscriptions =
          this.visit_service.onMedicationChanged.subscribe(medication => {
              this.medication = medication;
          });

      this.onSelectedMedicationChangedSubscription =
          this.visit_service.onSelectedContactsChanged.subscribe(selectedContacts => {
              this.selectedMedications = selectedContacts;
          });

    this.patientName = this.visit_note.patientName
    this.date = this.visit_note.returnDate();
   }

  ngOnInit() {

    this.visitnoteId = this.visit_note.passData()
    // this.patientService.getvisitNoteIdFromComponent(this.visitnoteId);
  
    //get medication data from service
   
        console.log('med-list isEdit', this.isEdit);
        if(this.isEdit === false){
            return;
        } else {
            this.dataSource = new FileDataSource(this.visit_service);
        }
        
    
    
  }

  ngOnDestroy(){
    this.onMedicationsChangedSubscriptions.unsubscribe();
   
    this.onSelectedMedicationChangedSubscription.unsubscribe(); 
     
 }


editMedication(medication)
  {
      this.dialogRef = this.dialog.open(MedicationFormComponent, {
          panelClass: 'contact-form-dialog',
          data      : {
              medication: medication,
              id:this.visitnoteId,
              action : 'edit',
              patientName : this.patientName
          }
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
                    
                      this.visit_service.updateMedication(this.visit_note.passData(),formData.getRawValue());
                      this.toastr.success('Save succesfully');
                      break;
                  /**
                   * Delete
                   */
                  case 'delete':

                      this.deleteMedication(medication);
                      
                      break;
              }
          });
  }
  deleteMedication(medication)
  {
      this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
          disableClose: false
      });

      this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

      this.confirmDialogRef.afterClosed().subscribe(result => {
          if ( result )
          {
              this.visit_service.deleteMedication(this.visit_note.passData(),medication);
              this.toastr.success(medication.name + ' ' + ' Was Delete succesfully');
          }
          this.confirmDialogRef = null;
      });

  }


}

export class FileDataSource extends DataSource<any>
{
    constructor(private patientService: ServiceVisitNode)
    {
        super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]>
    {
        return this.patientService.onMedicationChanged;
    }

    disconnect()   
    {
         
    }
  }
 
