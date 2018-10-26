import { FuseUtils } from '../../../core/fuseUtils'

export class Patient {

  //SECTION 1
  guid: string;
  fname: string;
  lname: string;
  ic: string;
  passport: string;
  others: string;
  mrn: string;
  birthday: Date;
  CalcAge: string;
  age: number;
  sex: string;
  alamat: string;
  bandar: string;
  poskod: number;
  negeri: string;
  negara: string;
  date: Date;
  time: string;
  //SECTION 2
  citizen: string;
  country: string;
  ethnic: string;
  religion: string;
  marital: string;
  living: string;
  accommodation: string;
  education: string;
  fee: string;
  occupation: string;
  occupation_unemployed: string;
  occupation_employed: string;
  registration_type:string;

  work: string;
  //SECTION 3
  allergies = [
    "Allergic rhinitis",
    "Sinusitis",
    "Asthma",
    "Food allergies",
    "Bee sting allergy (insect venom allergy)",
    "Latex allergy",
    "Drug allergies",
    "Skin contact allergy",
    "Eczema",
    "Allergic conjunctivitis",
    "Chemical sensitivity",
    "Others"
  ];

  allergy_list: Array<any>;
  allergy_others: string;
  admission: string;
  //SECTION 4
  famfname: string;
  famlname: string;
  relationship: string;
  relayname: string;
  contact: string;
  address1: string;
  city: string;
  postcode: string;
  state: string;
  //HIDDEN
  medicalID: string;

  current_assigned_doctor: string;
  doctorid: string

  country2: string

  constructor(patient?) {

    this.allergy_list = [];

    this.allergies.forEach(allergy => {
      // if(allergy == "Latex allergy")
      //   this.allergy_list.push(true);
      // else
      this.allergy_list.push(false);
    });

    patient = patient || {};
    // this.guid = patient.guid || FuseUtils.generateGUID(); // Don't add this as it will prevent guid from firebase to be listed
    //SECTION 1
    this.fname = patient.fname || '';
    this.lname = patient.lname || '';
    this.ic = patient.ic || '';
    this.passport = patient.passport || '';
    this.others = patient.others || '';
    this.mrn = patient.mrn || '';
    this.birthday = patient.birthday || '';
    this.CalcAge = patient.CalcAge || '';
    this.age = patient.age || '';
    this.sex = patient.sex || '';
    this.alamat = patient.alamat || '';
    this.bandar = patient.bandar || '';
    this.poskod = patient.poskod || '';
    this.negeri = patient.negeri || '';
    this.negara = patient.negara || '';
    this.date = patient.date || '';
    this.time = patient.time || '';
    this.registration_type = patient.registration_type || '';
    //SECTION 2
    this.citizen = patient.citizen || '';
    this.country = patient.country || '';
    this.ethnic = patient.ethnic || '';
    this.religion = patient.religion || '';
    this.marital = patient.marital || '';
    this.living = patient.living || '';
    this.accommodation = patient.accommodation || '';
    this.education = patient.education || '';
    this.fee = patient.fee || '';
    this.occupation = patient.occupation || '';
    this.work = patient.work || '';
    //SECTION 3
    // this.allergy = patient.allergy || '';
    this.allergy_others = patient.allergy_others || '';
    this.admission = patient.admission || '';
    //SECTION 4
    this.famfname = patient.famfname || '';
    this.famlname = patient.famlname || '';
    this.relationship = patient.relationship || '';
    this.relayname = patient.relayname || '';
    this.contact = patient.contact || '';
    this.address1 = patient.address1 || '';
    this.city = patient.city || '';
    this.postcode = patient.postcode || '';
    this.state = patient.state || '';
    this.country2 = patient.country2 || '';
    
    //additional info
    this.current_assigned_doctor = patient.current_assigned_doctor || '';
    this.doctorid = patient.doctorid || '';

    //Hidden
    this.medicalID = FuseUtils.generateGUID();
  }

}
