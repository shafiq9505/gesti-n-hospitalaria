import { FuseUtils } from '../../../../core/fuseUtils';

export class PatientInfo
{
  id      : string;
  medicalID: string;
  lname   : string;
  fname    : string;
  ic       : string;
  sex      :string;
  birthday : any
  age: any;
  race: string;
  religion: string;
  address : string;
  postcode: string;
  city    : string;
  state   : string;
  phone   : string;
  faxno   : string;
  team    : any[];
  users   : any[];
  admission  : any;
  citizen: string;
  current_assigned_doctor: any;
  current_assigned_branch: any;
  doctorid: string;

    constructor(patientinfo?)
    {
        patientinfo = patientinfo || {};
        this.id      = patientinfo.id || FuseUtils.generateGUID();
        this.medicalID = patientinfo.medicalID || FuseUtils.generateGUID();
        this.lname   = patientinfo.lname || '';
        this.fname    = patientinfo.fname || '';
        this.ic  = patientinfo.ic || '';
        this.sex = patientinfo.sex || '';
        this.race = patientinfo.race || '';
        this.religion = patientinfo.religion || '';
        this.birthday = patientinfo.birthday || '';
        this.age = patientinfo.age || '';
        this.current_assigned_doctor    = patientinfo.current_assigned_doctor || '';
        this.address = patientinfo.address || '';
        this.postcode= patientinfo.postcode || '';
        this.city    = patientinfo.city || '';
        this.state   = patientinfo.state || '';
        this.phone   = patientinfo.phone || '';
        this.faxno   = patientinfo.faxno || '';
        this.team    = patientinfo.team || [];
        this.users   = patientinfo.users || [];
        this.admission  = patientinfo.admision || [];
        this.citizen = patientinfo.citizen || '';
        this.current_assigned_branch = patientinfo.current_assigned_branch || '';
        this.current_assigned_doctor = patientinfo.current_assigned_doctor || [];
        this.doctorid = patientinfo.doctorid || '';
    }
}
