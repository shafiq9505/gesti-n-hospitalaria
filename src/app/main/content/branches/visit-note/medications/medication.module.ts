import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MedicationComponent } from '../../visit-note/medications/medication.component';
import { MedicationService } from '../../visit-note/medications/medication.service';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../../core/modules/shared.module';
import { FuseContactsComponent } from '../../../medication/medication.component';
import { ContactsService } from '../../../medication/medication.service';
const routes = [
  {
    path        : 'medicationvisit',
    component  : MedicationComponent ,
    resolve  : {
        contacts: MedicationService
    }
  },
]

@NgModule({

  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MedicationComponent,
  ],
  exports:[
    MedicationComponent
  ],
  providers:[
    MedicationService
  ],
  entryComponents: [MedicationComponent]
})
export class MedicationModule { }
