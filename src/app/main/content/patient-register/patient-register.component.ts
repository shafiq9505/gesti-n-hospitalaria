import { Component, OnDestroy, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
//import { locale as english } from './i18n/en';
//import { locale as turkish } from './i18n/tr';
import { FuseTranslationLoaderService } from '../../../core/services/translation-loader.service';
import { fuseAnimations } from '../../../core/animations';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
//import { FormControl, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subscription } from 'rxjs/Subscription';
import { Patient } from './patient-register.model';
import { MatButtonModule } from '@angular/material/button';
import { PatientRegisterService } from './patient-register.service';
import * as moment from 'moment';
import { MatStepperModule } from '@angular/material/stepper';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styleUrls: ['./patient-register.component.scss'],
  animations: fuseAnimations
})
export class PatientRegisterComponent implements OnInit {
  patient: Patient;
  section1: FormGroup;
  section2: FormGroup;
  section3: FormGroup;
  section4: FormGroup;
  formErrors: any;
  @ViewChild('citizenship') citizenship: ElementRef;

  // public checks: Array<ChoiceClass> = [
  //   {description: 'Allergic rhinitis', value: 'Allergic rhinitis'},
  //   {description: "Sinusitis", value: 'Sinusitis'},
  //   {description: "Asthma", value: 'Asthma'}
  // ];


  constructor(
    private prs: PatientRegisterService,
    private router: Router) {
    this.formErrors = {
      //SECTION 1
      fname: {},
      lname: {},
      mrn: {},
      birthday: {},
      age: {},
      sex: {},
      alamat: {},
      bandar: {},
      poskod: {},
      negeri: {},
      negara: {},
      time: {},
      date: {},
      //SECTION 2
      citizen: {},
      country: {},
      ethnic: {},
      religion: {},
      marital: {},
      living: {},
      accommodation: {},
      education: {},
      fee: {},
      occupation: {},
      work: {},
      //SECTION 3
      allergy: {},
      othersname: {},
      admission: {},
      //SECTION 4
      famfname: {},
      famlname: {},
      relationship: {},
      relayname: {},
      contact: {},
      address1: {},
      city: {},
      postcode: {},
      state: {},
      country2: {},
      current_assigned_doctor: {}
    };


  }


  ngOnInit() {

    this.patient = new Patient();
    // console.log(this.patient);
    // this.allergies = new Allergies;
    this.patient.ic = " ";
    this.patient.passport = " ";
    this.patient.others = " ";

    this.section1 = new FormGroup({
      'fname': new FormControl(this.patient.fname),
      'lname': new FormControl(this.patient.lname),
      'ic': new FormControl(this.patient.ic),
      'passport': new FormControl(this.patient.passport),
      'others': new FormControl(this.patient.others),
      'mrn': new FormControl(this.patient.mrn),
      'birthday': new FormControl(this.patient.birthday),
      'age': new FormControl(this.patient.age),
      'sex': new FormControl(this.patient.sex),
      'alamat': new FormControl(this.patient.alamat),
      'bandar': new FormControl(this.patient.bandar),
      'poskod': new FormControl(this.patient.poskod),
      'negeri': new FormControl(this.patient.negeri),
      'negara': new FormControl(this.patient.negara),
      'date': new FormControl(this.patient.date),
      'time': new FormControl(this.patient.time),
      'regType': new FormControl(this.patient.registration_type)
    });

    this.section2 = new FormGroup({
      'citizen': new FormControl(this.patient.citizen),
      'country': new FormControl(this.patient.country),
      'ethnic': new FormControl(this.patient.ethnic),
      'religion': new FormControl(this.patient.religion),
      'marital': new FormControl(this.patient.marital),
      'living': new FormControl(this.patient.living),
      'accommodation': new FormControl(this.patient.accommodation),
      'education': new FormControl(this.patient.education),
      'fee': new FormControl(this.patient.fee),
      'occupation': new FormControl(this.patient.occupation),
      'occupation_employed': new FormControl(this.patient.occupation_employed),
      'occupation_unemployed': new FormControl(this.patient.occupation_unemployed),
      'work': new FormControl(this.patient.work)
    });

    // let allergylist = [
    //   new FormControl(this.patient.allergy_list[0]),
    //   new FormControl(this.patient.allergy_list[1]),
    //   new FormControl(this.patient.allergy_list[2])];

    let allergylist = [];
    // this.patient.allergies.forEach(allergy => {
    //   allergylist.push(new FormControl(false));
    // });
    let x;
    for (x = 0; x < this.patient.allergies.length; x++) {

      allergylist.push(new FormControl(this.patient.allergy_list[x]));
    }
    // console.log(this.patient.allergies.length);
    // console.log(allergylist);

    let checkboxArray = new FormArray(allergylist);


    this.section3 = new FormGroup({
      // 'allergy' : new FormControl(this.patient.allergy),
      'allergies': checkboxArray,
      'othersname': new FormControl(this.patient.allergy_others),
      'admission': new FormControl(this.patient.admission)
    });

    this.section4 = new FormGroup({
      'famfname': new FormControl(this.patient.famfname),
      'famlname': new FormControl(this.patient.famlname),
      'relationship': new FormControl(this.patient.relationship),
      'relayname': new FormControl(this.patient.relayname),
      'contact': new FormControl(this.patient.contact),
      'address1': new FormControl(this.patient.address1),
      'postcode': new FormControl(this.patient.postcode),
      'state': new FormControl(this.patient.state),
      'city': new FormControl(this.patient.city),
      'country2': new FormControl(this.patient.country2),
      'current_assigned_doctor': new FormControl(this.patient.current_assigned_doctor)

    });
  }

  //SECTION 1
  get fname() { return this.section1.get('fname'); }
  get lname() { return this.section1.get('lname'); }
  get ic() { return this.section1.get('ic'); }
  get passport() { return this.section1.get('passport'); }
  get others() { return this.section1.get('others'); }
  get mrn() { return this.section1.get('mrn'); }
  get birthday() { return this.section1.get('birthday'); }
  get age() { return this.section1.get('age'); }
  get sex() { return this.section1.get('sex'); }
  get alamat() { return this.section1.get('alamat'); }
  get bandar() { return this.section1.get('bandar'); }
  get poskod() { return this.section1.get('poskod'); }
  get negeri() { return this.section1.get('negeri'); }
  get negara() { return this.section1.get('negara'); }
  get patientRegType() { return this.section1.get('registration_type')}
  //SECTION 2
  get citizen() { return this.section2.get('citizen'); }
  get country() { return this.section2.get('country'); }
  get ethnic() { return this.section2.get('ethnic'); }
  get religion() { return this.section2.get('religion'); }
  get marital() { return this.section2.get('marital'); }
  get living() { return this.section2.get('living'); }
  get accommodation() { return this.section2.get('accommodation'); }
  get education() { return this.section2.get('education'); }
  get fee() { return this.section2.get('fee'); }
  get occupation() { return this.section2.get('occupation'); }
  get work() { return this.section2.get('work'); }
  //SECTION 3
  get patient_allergies() { return this.section3.get('allergies') as FormArray; }
  // get allergies() { return <FormArray>this.section3.get('allergy'); }
  get othersname() { return this.section3.get('othersname'); }
  get admission() { return this.section3.get('admission'); }
  //SECTION 4
  get famfname() { return this.section4.get('famfname'); }
  get famlname() { return this.section4.get('famlname'); }
  get relationship() { return this.section4.get('relationship'); }
  get relayname() { return this.section4.get('relayname'); }
  get contact() { return this.section4.get('contact'); }
  get address1() { return this.section4.get('address1'); }
  get city() { return this.section4.get('city'); }
  get state() { return this.section4.get('state'); }
  get postcode() { return this.section4.get('postcode'); }
  get country2() { return this.section4.get('country2'); }
  get current_assigned_doctor() { return this.section4.get('current_assigned_doctor'); }

  formSubmit() {
    console.log(this.section1.getRawValue());
    this.prs.newPatient(this.section1.getRawValue());
  }

  calcAge() {
    console.log("Calc Age");
    console.log(this.patient.birthday);
    this.patient.age = moment(new Date()).diff(moment(this.patient.birthday), 'years');
  }

  registerPatient() {
    console.log(this.patient);
    this.prs.newPatient(this.patient).then(result => {
      console.log(result);
      this.router.navigate(['/branches']);
    }).catch(error => {
      console.log(error);
    })
  }

  onChange(event) {
    console.log("Patient Info");
    console.log(this.patient);
    this.scrollToSectionHook();

    switch (event.selectedIndex) {
      case 0:

        break;
      case 1:

        break;

      case 2:
        break;

    }
  }

  private scrollToSectionHook() {
    const element = document.querySelector('.stepperTop');
    // console.log(element);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'instant', block: 'start', inline:
            'nearest'
        });
      }, 250);
    }
  }
}
