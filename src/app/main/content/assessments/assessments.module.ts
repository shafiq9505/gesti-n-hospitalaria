import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { RouterModule } from '@angular/router';
import { AssessmentsComponent } from './assessments.component';
import { QuestionsService } from './questions.service';

import { FuseQuestionsQuestionListComponent } from './question-list/question-list.component';
import { FuseQuestionsSelectedBarComponent } from './selected-bar/selected-bar.component';
import { FuseQuestionsQuestionFormDialogComponent } from './question-form/question-form.component';
//import { FuseQuestionsMainSidenavComponent } from './sidenavs/main/main.component';

const routes = [
  {
    path        : 'assessments',
    component  : AssessmentsComponent,
    resolve  : {
        questions: QuestionsService
    }
  }
];

@NgModule({
  declarations: [
    AssessmentsComponent,
    FuseQuestionsQuestionListComponent,
    FuseQuestionsSelectedBarComponent,
    //FuseQuestionsMainSidenavComponent,
    FuseQuestionsQuestionFormDialogComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    AssessmentsComponent
  ],
  providers      : [
      QuestionsService
  ],
  entryComponents: [FuseQuestionsQuestionFormDialogComponent]
})
export class AssessmentsModule { }
