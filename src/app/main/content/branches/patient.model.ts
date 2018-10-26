import { FuseUtils } from '../../../core/fuseUtils';

export class Patient {
    fname: string;
    lname: string;
    ic: string;
    icno: string;
    dob: string;
    day: string;
    month: string;
    year: string;
    occupation: string;
    occupation_unemployed: string;
    occupation_employed: string;
    age: number;
    sex: string;
    citizen: string;
    ethnic: string;
    religion: string;
    marital: string;
    education: string;
    allergy: string;
    city: string;
    street: string;
    postcode: string;
    othersname: string;
    relationship: string;
    relayname: string;
    admission: string;
    famfname: string;
    famlname: string;
    CalcAge: string;
    address: string;
    contact: string;
    work: string;
    country2: string;
    country1: string;
    birthday: string;
    state: string;
    id: string;
    current_assigned_doctor: string;
    selfharm: string;
    selfharm_status: boolean;
    doctorid: string;
    highalert: string;

    constructor(patient) {
        {
            this.id = patient.id || FuseUtils.generateGUID();
            this.fname = patient.fname || '';
            this.lname = patient.name || '';
            this.ic = patient.ic || '';
            this.occupation = patient.occupation || '';
            this.birthday = patient.birthday || '';
            this.age = patient.age || '';
            this.sex = patient.sex || '';
            this.citizen = patient.citizen || '';
            this.religion = patient.religion || '';
            this.marital = patient.marital || '';
            this.education = patient.education || '';
            this.admission = patient.admission || '';
            // /Addition
            this.famfname = patient.famfname || '';
            this.famlname = patient.famlname || '';
            this.address = patient.address || '';
            this.country1 = patient.country1 || '';
            this.current_assigned_doctor = patient.current_assigned_doctor || '';
            this.doctorid = this.doctorid || '';
            this.selfharm_status = patient.selfharm_status || '';
            this.highalert = patient.highalert || 'false';

        }
    }
}
