import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {OccassionService} from '../../branches/patient-info/occassionService.model'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import {OccasionserviceService} from '../occasionservice.service'
import { MasterConfig } from '../../branches/masterconfig.model';
@Component({
  selector: 'app-occasion-service-form',
  templateUrl: './occasion-service-form.component.html',
  styleUrls: ['./occasion-service-form.component.scss']
})
export class OccasionServiceFormComponent implements OnInit {

  action : string;
  occassion : OccassionService
  MasterConfig: MasterConfig
  dialogTitle: string;
  contactForm:FormGroup
  OncategoryChanged : Subscription
  categories : any[] ;
  constructor(
    public dialogRef: MatDialogRef<OccasionServiceFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    private OccasionserviceService:OccasionserviceService
  ) {

    this.OncategoryChanged = this.OccasionserviceService.onCategoryChanged
    .subscribe (categoryDataArray => {
      this.categories= categoryDataArray;
 
    })
    this.action = data.action;
    this.OncategoryChanged = this.OccasionserviceService.onCategoryChanged
    .subscribe(categoryDataArray => {
      this.categories= categoryDataArray;
     
    })
    
    if ( this.action === 'edit' )
    {
        this.dialogTitle = 'Edit Occassion Of Service';
        this.occassion = data.occassion;
       
    }
    else
    {
        this.dialogTitle = 'New Medication Information';
        this.occassion = new OccassionService({})
    }

    this.contactForm = this.createOccassion()
   }


  ngOnInit() {


  }

  createOccassion()
  {
    return this.formBuilder.group({
      id : [this.occassion.id],
      location : [this.occassion.location],
      category : [this.occassion.category],
      complexity: [this.occassion.complexity],
      name : [this.occassion.name],
      minutes : [this.occassion.minutes],
      status : [this.occassion.status],
      outcome: [this.occassion.outcome],
    
    })
  }

}
