import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { BranchMgtComponent } from './branchmgt.component';
import { BranchService } from './branch.service';

import { FuseBranchBranchListComponent } from './branch-list/branch-list.component';
import { FuseBranchSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseBranchBranchFormDialogComponent } from './branch-form/branch-form.component';

import { FuseBranchInfoComponent } from './branch-info/branch-info.component';
import { FuseBranchInfoService } from './branch-info/branch-info.service';
import { BranchUserFormComponent } from './branch-user-form/branch-user-form.component';

const routes = [
  {
    path        : 'branchmgt',
    component  : BranchMgtComponent,
    resolve  : {
        branch: BranchService
    }
  },
  {
    path        : 'branchmgt/:id',
    component  : FuseBranchInfoComponent,
    resolve  : {
        branch: FuseBranchInfoService
    }
  }
];

@NgModule({
  declarations: [
    BranchMgtComponent,
    FuseBranchBranchListComponent,
    FuseBranchSelectedBarComponent,
    FuseBranchBranchFormDialogComponent,
    FuseBranchInfoComponent,
    BranchUserFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    BranchMgtComponent
  ],
  providers      : [
    BranchService,
    FuseBranchInfoService
  ],
  entryComponents: [
    FuseBranchBranchFormDialogComponent,
    BranchUserFormComponent
  ]
})
export class BranchMgtModule { }
