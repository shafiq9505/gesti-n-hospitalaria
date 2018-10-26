import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../core/modules/shared.module';
import { UsersComponent } from './users.component';
import { ContactsService } from './users.service';
import { ContactsFirebaseService } from './users-firebase.service';
import { FuseContactsContactListComponent } from './users-list/users-list.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseContactsContactFormDialogComponent } from './users-form/users-form.component';
import { FuseContactsMainSidenavComponent } from './sidenavs/main/main.component';
import { ContactListFbComponent } from './users-list-fb/users-list-fb.component';

const routes = [
  {
    path        : 'users',
    component  : UsersComponent,
    resolve  : {
        contacts: ContactsFirebaseService
    }
  }
];

@NgModule({
  declarations: [
    UsersComponent,
    FuseContactsContactListComponent,
    FuseContactsSelectedBarComponent,
    FuseContactsMainSidenavComponent,
    FuseContactsContactFormDialogComponent,
    ContactListFbComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    UsersComponent
  ],
  providers      : [
      ContactsService,
      ContactsFirebaseService
  ],
  entryComponents: [FuseContactsContactFormDialogComponent]
})
export class UsersModule { }
