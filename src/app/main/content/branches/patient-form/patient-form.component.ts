// import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// import { FormBuilder, FormGroup } from '@angular/forms';
// import { Subject } from 'rxjs/Subject';
// import { Patient } from '../patient.model';
// import { MatSelectModule } from '@angular/material/select';
//
// @Component({
//   selector: 'app-doctor-form',
//   templateUrl: './patient-form.component.html',
//   styleUrls: ['./patient-form.component.scss'],
//   encapsulation: ViewEncapsulation.None
// })
// export class NewDoctorFormComponent implements OnInit {
//
//   dialogTitle: string;
//   doctorForm: FormGroup;
//   action: string;
//   _patient: Patient;
//
//   constructor(
//     public dialogRef: MatDialogRef<NewDoctorFormComponent>,
//     @Inject(MAT_DIALOG_DATA) private data: any,
//     private formBuilder: FormBuilder
//   ) {
//       this.action = data.action;
//
//       if( this.action === 'edit' ){
//         this.dialogTitle = 'Edit Doctor Form';
//         this._patient = data.patient;
//       }
//       else {
//         this.dialogTitle = 'New Doctor Form';
//         this._patient = new Patient({});
//       }
//
//       this.doctorForm = this.createPatient();
//      }
//
//   ngOnInit() {
//   }
//
//   createPatient(){
//     return this.formBuilder.group({
//       id                     :[this._patient.id],
//       current_assigned_doctor:[this._patient.current_assigned_doctor]
//     })
//   }
// }
