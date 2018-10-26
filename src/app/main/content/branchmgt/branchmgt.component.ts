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
import { BranchService } from './branch.service';
import { FuseBranchBranchFormDialogComponent } from './branch-form/branch-form.component';

@Component({
  selector: 'app-branchmgt',
  templateUrl: './branchmgt.component.html',
  styleUrls: ['./branchmgt.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,

})
export class BranchMgtComponent implements OnInit {

  hasSelectedBranch: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedBranchChangedSubscription: Subscription;


  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private bfs: BranchService,
    public dialog: MatDialog
  ) {
    this.translationLoader.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
   }

  ngOnInit() {
    this.onSelectedBranchChangedSubscription =
        this.bfs.onSelectedBranchChanged
            .subscribe(selectedBranch => {
                this.hasSelectedBranch = selectedBranch.length > 0;
            });

    this.searchInput.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe(searchText => {
            this.bfs.onSearchTextChanged.next(searchText);
        });

  }

  newBranch()
  {
      this.dialogRef = this.dialog.open(FuseBranchBranchFormDialogComponent, {
          panelClass: 'branch-form-dialog',
          data      : {
              action: 'new'
          },
          width     : '60%'
      });

      this.dialogRef.afterClosed()
          .subscribe((response: FormGroup) => {
              if ( !response )
              {
                  return;
              }
              console.log(response.getRawValue().name);
              this.bfs.newBranch(response.getRawValue());

          });

  }



}
