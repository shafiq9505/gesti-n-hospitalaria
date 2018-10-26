import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FuseContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { FuseContactsComponent } from './medication.component';
import { ContactsService } from './medication.service';
import { FuseContactsContactListComponent } from './medication-list/medication-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseContactsContactFormDialogComponent } from './medication-form/medication-form.component';
import {MedicationFirebaseService} from './medication-firebase.service';
const routes: Routes = [
    {
        path     : 'medication',
        component: FuseContactsComponent,
        resolve  : {
            contacts: ContactsService
        }
    }
];

@NgModule({
    imports        : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    declarations   : [
        FuseContactsComponent,
        FuseContactsContactListComponent,
        FuseContactsSelectedBarComponent,
        FuseContactsMainSidenavComponent,
        FuseContactsContactFormDialogComponent
    ],
    providers      : [
        ContactsService,
        MedicationFirebaseService
    ],
    entryComponents: [FuseContactsContactFormDialogComponent]
})
export class FuseContactsModule
{
}
