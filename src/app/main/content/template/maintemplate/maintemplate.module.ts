import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../../core/modules/shared.module';
import { MainTemplateComponent } from './maintemplate.component';
import { TemplateFirebaseService } from '../templateFirebase.Service';
import { TemplateService } from '../template.service';
// import { FuseContactsContactListComponent } from './contact-list/contact-list.component';
import { FuseTemplateSelectedBarComponent } from '../selected-bar/selected-bar.component';
import { FuseTemplateTemplateFormDialogComponent } from '../template-form/template-form.component';
import { FuseTemplateMainSidenavComponent } from '../sidenavs/main/main.component';
// import { ContactListFbComponent } from './contact-list-fb/contact-list-fb.component';
// import { TemplateFormComponent } from '../template-form/template-form.component';
import { TemplateListFbComponent } from '../template-list-fb/template-list-fb.component';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const routes = [
  {
    path        : 'template',
    component  : MainTemplateComponent,
    resolve  : {
        template: TemplateFirebaseService
    }
  }
];

@NgModule({
  declarations: [
    MainTemplateComponent,
    TemplateListFbComponent,
    FuseTemplateSelectedBarComponent,
    FuseTemplateMainSidenavComponent,
    FuseTemplateTemplateFormDialogComponent,
    TemplateListFbComponent

  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()

  ],
  exports: [
    MainTemplateComponent,

  ],
  providers      : [
    TemplateService,
    TemplateFirebaseService
  ],
  entryComponents: [FuseTemplateTemplateFormDialogComponent]
})
export class TemplateModule { }
