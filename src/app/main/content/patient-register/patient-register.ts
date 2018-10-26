export class Patient {
  //SECTION 1
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
  
  work: string;
  //SECTION 3
  allergy: string;
  othersname: string;
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
  country2: string

constructor(patient){
  this.ic = patient.ic || ' ';
  this.passport = patient.passport || ' ';
  this.others = patient.others || ' ';
  }
}
