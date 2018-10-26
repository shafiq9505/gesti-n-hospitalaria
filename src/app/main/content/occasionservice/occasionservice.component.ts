import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import {OccasionserviceService} from './occasionservice.service'
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-occasionservice',
  templateUrl: './occasionservice.component.html',
  styleUrls: ['./occasionservice.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class OccasionserviceComponent implements OnInit {

  hasSelectedOccasion: boolean;
  searchInput: FormControl;
  dialogRef: any;
 onOccassionChangedSubscription : Subscription;

  constructor(
  private occassionService :OccasionserviceService,
  public dialog: MatDialog) 
  {
    this.searchInput = new FormControl('');
  }

  ngOnInit() {
    this.onOccassionChangedSubscription =
    this.occassionService.onOccassionChanged
        .subscribe(selectedContacts => {
            this.hasSelectedOccasion = selectedContacts.length > 0;
        });

this.searchInput.valueChanges
    .debounceTime(300)
    .distinctUntilChanged()
    .subscribe(searchText => {
        this.occassionService.onSearchTextChanged.next(searchText);
    });

  }

  ngOnDestroy()
  {
      this.onOccassionChangedSubscription.unsubscribe();
  }

}
