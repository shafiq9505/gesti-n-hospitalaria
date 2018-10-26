import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { CommonModule } from '@angular/common';
import { PatientRegisterComponent } from './patient-register.component';
import { PatientRegisterService } from './patient-register.service';

const routes = [
  {
    path: 'patient-register',
    component: PatientRegisterComponent,
    // resolve  : {
    //     contacts: ContactsService
    // }
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PatientRegisterComponent],
  providers: [
    PatientRegisterService
  ],

})
export class PatientRegisterModule { }
