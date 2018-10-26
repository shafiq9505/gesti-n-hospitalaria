import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MasterconfigComponent } from './masterconfig.component';

import { FuseContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { ContactsService } from './contacts.service';
import { FuseContactsContactListComponent } from './medicationConfig_List/contact-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseContactsContactFormDialogComponent } from './medicationConfig_Form/contact-form.component';



const routes = [
{
  path      : 'medicationConfig',
  component :  MasterconfigComponent,
  resolve  : {
      contacts: ContactsService
  }
}

];

@NgModule({

  declarations: [
    MasterconfigComponent,
    FuseContactsContactListComponent,
    FuseContactsSelectedBarComponent,
    FuseContactsMainSidenavComponent,
    FuseContactsContactFormDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  
  providers : [
    ContactsService,
    
  ],
    entryComponents: [FuseContactsContactFormDialogComponent]

})
export class MedicationConfigModule { }
