import {MedicationService} from './medication.service';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { Component, Inject,OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '../../../../../core/animations';
import { extend } from 'webdriver-js-extender';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {medication} from '../../../medication/medication.model';
@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.scss'],
  encapsulation : ViewEncapsulation.None,
  animations : fuseAnimations
})
export class MedicationComponent implements OnInit {
  medicationlist : medication[]
  // @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
    
    dialogTitle : string;
    // contacts : any;
    // dataSource : FilesDataSource | null;
    // displayedColumn = ['medname', 'dosage','duration','frequency'];

    onContactsChangedSubscription: Subscription;
    onSelectedContactsChangedSubscription: Subscription;

  constructor( private medicationService : MedicationService,
  public dialog: MatDialog,
  public dialogRef: MatDialogRef<MedicationComponent>,
  @Inject(MAT_DIALOG_DATA) private data: any,
   ) 
        {
          this.medicationlist = this.medicationService.getData();
          this.dialogTitle = "List of medication";
         
          // this.dataSource = new FilesDataSource(this.medicationService);
          // this.onContactsChangedSubscription =
          // this.medicationService.onContactsChanged.subscribe(contacts => {
     
          //     this.contacts = contacts;

          //     contacts.map(contact =>{

          //     });
          //   });
        }

  ngOnInit() { 
   
    this.medicationlist = this.medicationService.getData();

   

}
}
// export class FilesDataSource extends DataSource<any>
// {
//   constructor(private medicationService : MedicationService)
//   {
//     super();
//   }
//   connect(): Observable<any[]>
//   {
//    return this.medicationService.onContactsChanged;
//   }

//   disconnect()
//   {

//   }
  // }

