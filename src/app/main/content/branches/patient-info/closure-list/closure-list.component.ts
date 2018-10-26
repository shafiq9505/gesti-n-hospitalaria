import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FusePatientInfoService } from '../patient-info.service';
import { Observable } from 'rxjs/Observable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { FormGroup } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { fuseAnimations } from '../../../../../core/animations';
import { Subscription } from 'rxjs/Subscription';
import { ClosureFormComponent } from '../closure-form/closure-form.component'

 @Component({
   selector: 'app-closure-list',
   templateUrl: './closure-list.component.html',
   styleUrls: ['./closure-list.component.scss'],
   animations: fuseAnimations
 })
 export class ClosureListComponent implements OnInit {

   closureLists: any[];
   closurelist: any
   dataSource: FileDataSource | null;
   displayColumns = ['checklist','followup','reasonofclosure','comment', 'casesummary'];
   selectedList: any[];

   onClosureChangedSubscription: Subscription;
   onSelectedList: Subscription;

   dialogRef: any;
   checkboxes: {};
   confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

   constructor(
     private patientInfoService: FusePatientInfoService,
     public dialog: MatDialog
   ) {
     this.onClosureChangedSubscription =
       this.patientInfoService.onClosureChanged
         .subscribe ( closureLists => {
           this.closureLists= closureLists;
         })
   }

   ngOnInit() {
     this.dataSource = new FileDataSource( this.patientInfoService )
   }

   ngOnDestroy(){
     this.onClosureChangedSubscription.unsubscribe();
   }


   editClosure(closure) {
     this.dialogRef = this.dialog.open(ClosureFormComponent, {
       panelClass: 'closure',
       data: {
         closure: closure,
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
           console.log('loct: closure-list.component','action: Saving Closure','actionType:',actionType);
           this.patientInfoService.updateClosure(formData.getRawValue());
           break;

           case 'delete':
             console.log('loct: closure-list.component', 'action: Delete Closure', 'actionType:', actionType);
             this.patientInfoService.deleteClosure(closure)
           break;

           default:
             console.log('loct: closure-list.component','default switch', 'actionType:', actionType);
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
     return this.patientInfoService.onClosureChanged;
   }

   disconnect()
   {

   }
 }
