import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import 'hammerjs';
import { SharedModule } from './core/modules/shared.module';
import { AppComponent } from './app.component';
import { FuseMainModule } from './main/main.module';
import { FuseSplashScreenService } from './core/services/splash-screen.service';
import { FuseConfigService } from './core/services/config.service';
import { FuseNavigationService } from './core/components/navigation/navigation.service';
import { UserLoginService } from './core/services/user-login.service';
import { FuseSampleModule } from './main/content/sample/sample.module';
import { UsersModule } from './main/content/users/users.module';
import { BranchesModule } from './main/content/branches/branches.module';
import { AssessmentsModule } from './main/content/assessments/assessments.module';
import { TranslateModule } from '@ngx-translate/core';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { environment } from '../environments/environment';
import { FuseFakeDbService } from './fuse-fake-db/fuse-fake-db.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { LoginModule } from './main/content/authentication/login/login.module';
import { FuseUIModule } from './main/content/ui/ui.module';
import { FuseScrumboardModule } from './main/content/scrumboard/scrumboard.module';
import { RegisterModule } from './main/content/users/register/register.module';
import { MailConfirmModule } from './main/content/authentication/mail-confirm/mail-confirm.module';
import { ForgotPasswordModule } from './main/content/authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from './main/content/authentication/reset-password/reset-password.module';
import { FirebaseService } from './core/services/firebase.service';
import { PatientRegisterModule } from './main/content/patient-register/patient-register.module';
import { BranchMgtModule } from './main/content/branchmgt/branchmgt.module';
//import { FuseContactsModule } from './main/content/icd10-database/contacts.module';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { TemplateModule } from './main/content/template/maintemplate/maintemplate.module';
import { FuseCalendarModule } from './main/content/calendar/calendar.module';
import {icd10Module} from './main/content/icd10/contacts.module';
import {ToastrModule} from 'ngx-toastr';
import { CommonModule } from '@angular/common';  
import { FusePipesModule } from './core/pipes/pipes.module';
import { FuseContactsModule } from './main/content/medication/medication.module';
import { MedicationModule } from './main/content/branches/visit-note/medications/medication.module';
import { MasterconfigModule } from './main/content/masterconfig/masterconfig.module';
import {OccasionserviceModule} from './main/content/occasionservice/occasionservice.module';
import { ReportModule } from './main/content/report/report.module';
import { FuseProjectDashboardModule } from './main/content/dashboards/project/project.module';
import {MedicationConfigModule} from './main/content/branches/medicationConfig/masterconfig.module';
import {ToolbarService} from './main/toolbar/toolbar.service'

const appRoutes: Routes = [
    {
        path      : '**',
        redirectTo: 'login'
    }
];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes),
        SharedModule,
        TranslateModule.forRoot(),
        ToastrModule.forRoot(),
        FuseMainModule,
        FuseSampleModule,
        UsersModule,
        FuseContactsModule,
        LoginModule,
        icd10Module,
        FuseUIModule,
        RegisterModule,
        MailConfirmModule,
        ForgotPasswordModule,
        SharedModule,
        ResetPasswordModule,
        PatientRegisterModule,
        BranchesModule,
        MedicationModule,
        FuseScrumboardModule,
        FuseCalendarModule,
        ReportModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFirestoreModule.enablePersistence(), // imports firebase/firestore, only needed for database features
        AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
        AngularFireStorageModule, // imports firebase/storage only needed for storage features
        AngularFireDatabaseModule,
        InMemoryWebApiModule.forRoot(FuseFakeDbService, {
            delay             : 0,
            passThruUnknownUrl: true,
        }),
        BranchMgtModule,
        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        TemplateModule,
        FusePipesModule,
        MasterconfigModule,
        OccasionserviceModule,
        FuseProjectDashboardModule,
        MedicationConfigModule
    ],
    providers   : [
        FuseSplashScreenService,
        FuseConfigService,
        FuseNavigationService,
        FirebaseService,
        UserLoginService,
        ToolbarService
    ],
    bootstrap   : [
        AppComponent
    ]
})
export class AppModule
{
}
