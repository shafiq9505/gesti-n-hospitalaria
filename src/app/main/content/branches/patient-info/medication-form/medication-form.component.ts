import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CalendarEvent } from 'angular-calendar';
import { FormBuilder, FormGroup, FormControl, FormControlName} from '@angular/forms';
import { medication } from '../../../medication/medication.model';
import {ToastrService} from 'ngx-toastr';
import {Visit} from '../visit.model';
import {PatientInfo} from '../patient-info.model';
import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatAutocompleteTrigger } from '@angular/material';
import { Observable } from '@firebase/util';
import {map, startWith} from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { FusePatientInfoService } from '../patient-info.service';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-medication-form',
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MedicationFormComponent implements OnInit {
  currentuser:any;
  patient : PatientInfo;
  visit : Visit;
  medication: medication;
  action : string
  medForm : FormGroup;
  event : CalendarEvent;
  date:string;
  patientName: string
  visit_record : string
  medicationname : string
  onMedicationChangedSubscription: Subscription;
  dialogTitle : string;
  filteredOptions: Observable<medication[]>;
  result : any;
  route :  FormControl = new FormControl('')
  name :  FormControl = new FormControl('') ;
  isEdit:boolean;
  medications = [];

  constructor(
    public dialogRef: MatDialogRef<MedicationFormComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private formBuilder: FormBuilder,
    public toastr : ToastrService,
    private patientInfoService: FusePatientInfoService,
    private readonly afs:AngularFirestore,
    
  ) { 
    //get data from the visit-note-form component.ts
    this.currentuser = JSON.parse(localStorage.getItem('currentuser'));
    this.date = new Date().toISOString();
    this.patientName = data.patientName
    this.visit_record = data.id
    this.action = data.action
    if ( this.action === 'edit' )
    {
        console.log('medication', data.medication);
        this.dialogTitle = 'Medication Information';
        this.isEdit = true;
        this.medication = data.medication;
       
    }
    else
    {
        this.dialogTitle = 'Create Medication Information';
        this.isEdit = false;
        this.medication = new medication({})
  
    }

      this.name.valueChanges.subscribe(val => {
        this.filterOptions(val)
      })

      this.medForm = new FormGroup(
        {
          'visitid': new FormControl({ value: this.visit_record, disabled: this.isEdit }),
          'id': new FormControl({ value: this.medication.id, disabled: this.isEdit }),
          'name': new FormControl({ value: this.name, disabled: this.isEdit }),
          'dosage': new FormControl({value:this.medication.dosage,disabled:this.isEdit}),
          'duration': new FormControl({ value: this.medication.duration, disabled: this.isEdit}),
          'frequency': new FormControl({ value: this.medication.frequency, disabled: this.isEdit}),
          'duration_unit': new FormControl({ value: this.medication.duration_unit, disabled: this.isEdit}),
          'patientName': new FormControl({ value: this.patientName, disabled: this.isEdit}),
          'date': new FormControl({ value: this.date, disabled: this.isEdit}),
          'route': new FormControl({ value: this.medication.route, disabled: this.isEdit}),
          'doctorName': new FormControl({ value: this.currentuser.name + ' ' + this.currentuser.lastName, disabled: this.isEdit})
        })
       
  
 

    // this.medForm = this.createMedicationForm();
    // console.warn("yawwwwww",this.medForm);

 
  }


  ngOnInit()
  {
 
  }


  filterOptions(text: string) {

    this.onMedicationChangedSubscription = 
    this.patientInfoService.onMedicationConfigChanged
    .subscribe(medicationDataArray => {
      this.medications = medicationDataArray.filter(obj => obj.name.toLowerCase().indexOf(text.toString().toLowerCase()) === 0)
      // this.route = medicationDataArray.filter(obj => obj.route.toUpperCase().indexOf(text.toString().toUpperCase()) === 0)

     
    })
  }
}
