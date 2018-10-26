import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { VNoteTemplateComponent } from './visit-note/v-note-template';
import { RouterModule } from '@angular/router';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

@NgModule({
  imports: [
    CommonModule,
    // SharedModule,
    // RouterModule.forChild(routes)
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()

  ],
  declarations: [
    // VNoteTemplateComponent
  ],
  exports: [
    // VNoteTemplateComponent
  ],
})
export class VisitNoteModule { }
