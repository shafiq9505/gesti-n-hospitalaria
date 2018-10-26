import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MedicationComponent } from '../visit-note/medications/medication.component'
import { medication } from '../../medication/medication.model';
import { Observable } from 'rxjs/Observable';
import { FormControl, NgForm } from '@angular/forms';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from 'angularfire2/firestore';
import { ContactsService } from '../../medication/medication.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { ToastrService } from 'ngx-toastr'
@Component({
  selector: 'patient-visit-note',
  templateUrl: './visit-note.component.html',
  styleUrls: ['./visit-note.component.scss'],
  // animations   : fuseAnimations,
  // encapsulation: ViewEncapsulation.None,

})
export class VisitNoteComponent implements OnInit {
  isLinear = false;
  section1: FormGroup;
  section2: FormGroup;
  section3: FormGroup;
  section4: FormGroup;

  contactForm: FormGroup;
  contact: medication;
  dialogRef: any;

  // medicationlist : medication[];
  myControl = new FormControl();

  constructor(
    private _formBuilder: FormBuilder,
    private medicalFormBuilder: FormBuilder,
    private medicationservice: ContactsService,
    public toastr: ToastrService,
    public dialog: MatDialog,
  ) {
    //   this.contactForm = this.createContactForm();
  }

  ngOnInit() {


    this.section1 = this._formBuilder.group({
    });

    this.section2 = this._formBuilder.group({
    });

    this.section3 = this._formBuilder.group({
    });

    this.section4 = this._formBuilder.group({
    });

    this.contact = new medication({});

    this.contactForm = new FormGroup(
      {
        'id': new FormControl(this.contact.id),
        'name': new FormControl(this.contact.name),
        'dosage': new FormControl(this.contact.dosage),
        'duration': new FormControl(this.contact.duration),
        'frequency': new FormControl(this.contact.frequency),
        'duration_unit': new FormControl(this.contact.duration_unit)
      }
    )

  }
  onSubmit() {
    if (this.contactForm.valid) {
      this.medicationservice.updateContact(this.contact.id, this.contactForm.value)
      console.log("form submitted", this.contactForm.value);
      this.resetForm();
      this.toastr.success('submitted succesfully,Medication data is inserted ')
    }
  }

  resetForm() {
    if (this.contactForm != null) {
      this.contactForm.reset();
    }




  }

  createContactForm() {
    // return this.medicalFormBuilder.group(
    //     {
    //         id  : [this.contact.id],
    //         name    : [this.contact.name],
    //         dosage : [this.contact.dosage],
    //         duration : [this.contact.duration],
    //         duration_unit : [this.contact.duration_unit],
    //         frequency : [this.contact.frequency]
    //     }
    // );
  }
}
