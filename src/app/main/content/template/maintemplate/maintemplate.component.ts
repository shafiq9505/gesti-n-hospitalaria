import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { locale as english } from '../i18n/en';
import { locale as turkish } from '../i18n/tr';
import { FuseTranslationLoaderService } from '../../../../core/services/translation-loader.service';
import { fuseAnimations } from '../../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { FuseTemplateTemplateFormDialogComponent } from '../template-form/template-form.component';
import { TemplateFirebaseService } from '../templateFirebase.Service';
import { TemplateService } from '../template.service';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';


@Component({
  selector: 'app-maintemplate',
  templateUrl: './maintemplate.component.html',
  styleUrls: ['./maintemplate.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,

})
export class MainTemplateComponent implements OnInit {
  hasSelectedTemplate: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedTemplateChangedSubscription: Subscription;

  constructor(
    private translationLoader: FuseTranslationLoaderService,
    // private templateFirebaseService: TemplateFirebaseService,
    public dialog: MatDialog,
    private tfs: TemplateFirebaseService

  ) {
    this.translationLoader.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
}

  ngOnInit() {
    this.onSelectedTemplateChangedSubscription =
        this.tfs.onSelectedTemplateChanged
            .subscribe(selectedTemplate => {
                this.hasSelectedTemplate = selectedTemplate.length > 0;
            });

    this.searchInput.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe(searchText => {
            this.tfs.onSearchTextChanged.next(searchText);
        });

  }

  newTemplate()
  {

      this.dialogRef = this.dialog.open(FuseTemplateTemplateFormDialogComponent, {
          panelClass: 'temlate-form-dialog',
          data      : {
              action: 'new'
          }
      });

      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }
              console.log(response.getRawValue().name);
              this.tfs.newTemplate(response.getRawValue());
          });

  }


  }
