import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { BranchesComponent } from './branches.component';
import { PatientService } from './patient.service';
import { FusePatientListComponent } from './patient-list/patient-list.component';
import { FusePatientSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FusePatientMainSidenavComponent } from './sidenavs/main/main.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { FusePatientInfoComponent } from './patient-info/patient-info.component';
import { FusePatientInfoService } from './patient-info/patient-info.service';
import { VisitNoteComponent } from './visit-note/visit-note.component';
import { NewVisitNoteFormComponent } from './patient-info/visit-note-form/visit-note-form.component';
import { VisitNotesListComponent } from './patient-info/visit-notes-list/visit-notes-list.component';
import { ReferPatientDialogComponent } from './patient-info/refer-patient-dialog/refer-patient-dialog.component';
import { PatientAppointmentComponent } from './patient-info/patient-appointment/patient-appointment.component';
import { FuseCalendarEventFormDialogComponent } from './patient-info/event-form/event-form.component'
import { PatientAssessmentsComponent } from './patient-info/assessments/patient-appointment.component';
import { FuseAssessmentFormDialogComponent } from './patient-info/assessment-form/event-form.component';
import { ServiceVisitNode } from '../branches/patient-info/visit-service.service';
import { MedicationListComponent } from './patient-info/medication-list/medication-list.component';
import { MedicationFormComponent } from './patient-info/medication-form/medication-form.component';
import { resolve } from 'dns';
import { FuseFormsComponent  } from './patient-info/forms/forms.component';
import { TemplateFirebaseService } from '../template/templateFirebase.Service';
import { NewSelfHarmFormComponent } from './patient-info/self-harm/self-harm.component';
import { SelfHarmListComponent } from './patient-info/self-harm-list/self-harm-list.component';
import { UserLoginService } from '../../../core/services/user-login.service';
import { ReferralListComponent } from './patient-info/referral-list/referral-list.component';
//import { TagComponent } from './patient-info/visit-note-form/tag.component';
import { ClosureFormComponent } from './patient-info/closure-form/closure-form.component';
import { ClosureListComponent } from './patient-info/closure-list/closure-list.component';
import { MatInputModule, MatFormFieldModule } from '@angular/material';
import { PatientLogComponent } from './patient-list/patient-log/patient-log.component';
import { PatientLogServiceService } from './patient-list/patient-log/patient-log-service.service';


const routes = [
  {
    path: 'branches',
    component: BranchesComponent,
    canActivate: [UserLoginService],
    resolve: {
      patient: PatientService
    },
  },
  {
    path: 'branches/:id',
    component: FusePatientInfoComponent,
    resolve: {
      contacts: FusePatientInfoService
    },
    children: [
      {
        path: ':visits', component: VisitNotesListComponent,
        resolve: {
          visits: ServiceVisitNode
        }
      }
    ]
  },
];

@NgModule({
  declarations: [
    BranchesComponent,
    FusePatientListComponent,
    FusePatientSelectedBarComponent,
    FusePatientMainSidenavComponent,
    FusePatientInfoComponent,
    VisitNoteComponent,
    NewVisitNoteFormComponent,
    NewSelfHarmFormComponent,
    SelfHarmListComponent,
    VisitNotesListComponent,
    ReferPatientDialogComponent,
    FuseFormsComponent,
    MedicationListComponent,
    MedicationFormComponent,
    // FusePatientContactFormDialogComponent
    PatientAppointmentComponent,
    FuseCalendarEventFormDialogComponent,
    PatientAssessmentsComponent,
    FuseAssessmentFormDialogComponent,
    ReferralListComponent,
    //TagComponent,
    ClosureListComponent,
    ClosureFormComponent,
    PatientLogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    MatInputModule,
    MatFormFieldModule

  ],
  exports: [
    BranchesComponent,
    FuseFormsComponent
  ],
  providers: [
    PatientService,
    FusePatientInfoService,
    ServiceVisitNode,
    // MedicationService
    TemplateFirebaseService,
    // PatientService,
    // FusePatientInfoService,
    // TemplateFirebaseService
    PatientLogServiceService
  ],
  entryComponents: [
    /*FusePatientContactFormDialogComponent*/
    NewVisitNoteFormComponent,
    ReferPatientDialogComponent,
    FuseCalendarEventFormDialogComponent,
    PatientAssessmentsComponent,
    FuseAssessmentFormDialogComponent,
    FuseFormsComponent,
    MedicationFormComponent,
    // FuseFormsComponent,
    NewSelfHarmFormComponent,
    /*FusePatientContactFormDialogComponent*/
    NewVisitNoteFormComponent,
    FuseFormsComponent,
    NewSelfHarmFormComponent,
    ReferralListComponent,
    ClosureFormComponent,
    PatientLogComponent
  ]
})
export class BranchesModule { }
