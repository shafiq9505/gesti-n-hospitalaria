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
import { PatientService } from './patient.service';

// import { FusePatientContactFormDialogComponent } from './patient-form/patient-form.component';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrls: ['./branches.component.scss'],
  animations   : fuseAnimations,
  encapsulation: ViewEncapsulation.None,

})
export class BranchesComponent implements OnInit {

  hasSelectedPatient: boolean;
  searchInput: FormControl;
  dialogRef: any;
  onSelectedPatientChangedSubscription: Subscription;


  constructor(
    private translationLoader: FuseTranslationLoaderService,
    private patientService: PatientService,
    public dialog: MatDialog
  ) {
    this.translationLoader.loadTranslations(english, turkish);
    this.searchInput = new FormControl('');
   }

  ngOnInit() {
    this.onSelectedPatientChangedSubscription =
        this.patientService.onSelectedPatientChanged
            .subscribe(selectedPatient => {
                this.hasSelectedPatient = selectedPatient.length > 0;
            });

    this.searchInput.valueChanges
        .debounceTime(300)
        .distinctUntilChanged()
        .subscribe(searchText => {
            this.patientService.onSearchTextChanged.next(searchText);
        });

  }
}
