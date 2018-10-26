import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { MasterconfigComponent } from './masterconfig.component';

import { FuseContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { ContactsService } from './contacts.service';
import { FuseContactsContactListComponent } from './contact-list/contact-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseContactsContactFormDialogComponent } from './contact-form/contact-form.component';
import {MasterconfigFirebaseService} from './masterconfig-firebase.service';


const routes = [
{
  path      : 'masterconfig',
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
    MasterconfigFirebaseService
  ],
    entryComponents: [FuseContactsContactFormDialogComponent]

})
export class MasterconfigModule { }
