import { NgModule } from '@angular/core';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule, Routes } from '@angular/router';
import {OccasionserviceComponent} from './occasionservice.component';
import {OccasionserviceService} from './occasionservice.service';
import { OccasionServiceListComponent } from './occasion-service-list/occasion-service-list.component';
import { OccasionServiceFormComponent } from './occasion-service-form/occasion-service-form.component';
import { FuseContactsSelectedBarComponent } from './selected-bar/selected-bar.component';

const routes: Routes = [
  {
      path     : 'occassionsevice',
      component: OccasionserviceComponent,
      resolve  : {
          contacts: OccasionserviceService
      }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    OccasionserviceComponent,
    OccasionServiceListComponent,
    OccasionServiceFormComponent,
    FuseContactsSelectedBarComponent

  ],
  providers      : [
    OccasionserviceService
],
entryComponents: [OccasionServiceFormComponent]
})
export class OccasionserviceModule { }
