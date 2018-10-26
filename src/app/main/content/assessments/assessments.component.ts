import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { locale as english } from './i18n/en';
import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { QuestionsService } from './questions.service';
import { FuseQuestionsQuestionFormDialogComponent } from './question-form/question-form.component';


@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.scss'],
  animations: fuseAnimations,
  encapsulation: ViewEncapsulation.None,
})
export class AssessmentsComponent implements OnInit {

  hasSelectedQuestion: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedModuleChangedSubscription: Subscription;

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private questionService: QuestionsService,
    public dialog: MatDialog
  ) 
  { 
    this.translationLoader.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
  }

  ngOnInit() {
    
  }

  newModule()
  {
    this.dialogRef = this.dialog.open( FuseQuestionsQuestionFormDialogComponent, {
      panelClass: 'question-form-dialog',
      data      : {
        action: 'new'
      }
    });

    this.dialogRef.afterClosed()
      .subscribe((response: FormGroup) => {
        if ( !response ) {
          return;
        }
        this.questionService.updateQuestion(response.getRawValue());
      });
  }

}
