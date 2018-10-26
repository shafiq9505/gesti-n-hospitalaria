import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { FuseContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { FuseIcd10Component } from './contacts.component';
import { ContactsService } from './contacts.service';
import { FuseContactsContactListComponent } from './icd10-list/contact-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseContactsContactFormDialogComponent } from './icd10-form/contact-form.component';

const routes: Routes = [
    {
        path     : 'icd10',
        component: FuseIcd10Component,
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
        FuseIcd10Component,
        FuseContactsContactListComponent,
        FuseContactsSelectedBarComponent,
        FuseContactsMainSidenavComponent,
        FuseContactsContactFormDialogComponent
    ],
    providers      : [
        ContactsService
    ],
    entryComponents: [FuseContactsContactFormDialogComponent]
})
export class icd10Module
{
}
