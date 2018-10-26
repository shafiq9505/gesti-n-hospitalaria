import { FuseUtils } from '../../../../core/fuseUtils'

export class SelfHarm {

  guid: string;
  admitward: string;
  wardname: string;
  dateadmit: Date;
  timeadmit: string;
  arrivalmode: string;
  dateact: Date;
  timeact: string;
  occurance: string;
  method: string;
  poisonsname: string;
  medicinename: string;
  othermedname: string;
  expression: string;
  othersmode: string;
  suicidal: string;
  impulsive: string;
  accidential: string;
  disability: string;
  final: string;
  consequences: string;
  preattempt: string;
  attempt: string;
  illness: string;
  diagnoseill: string;
  treatment: string;
  lifeevents: string;
  otherlife: string;
  sexualabuse: string;
  datedischarge: Date;
  wardday: string;
  otherward: string;
  maindiagnosis: string;
  external: string;
  othermx: string;
  support: string;
  othersupport: string;
  therapy: string;
  othertherapy: string
  //status: string

    constructor(selfharm)
    {
        selfharm = selfharm || {};
        this.guid = selfharm.guid || FuseUtils.generateGUID();
        this.admitward = selfharm.admitward || '';
        this.wardname = selfharm.wardname || '';
        this.dateadmit = selfharm.dateadmit || '';
        this.timeadmit = selfharm.timeadmit || '';
        this.arrivalmode = selfharm.arrivalmode || '';
        this.dateact = selfharm.dateact || '';
        this.timeact = selfharm.timeact || '';
        this.occurance = selfharm.occurance || '';
        this.method = selfharm.method || '';
        this.poisonsname = selfharm.poisonsname || '';
        this.medicinename = selfharm.medicinename || '';
        this.othermedname = selfharm.othermedname || '';
        this.expression = selfharm.expression || '';
        this.othersmode = selfharm.othersmode || '';
        this.suicidal = selfharm.suicidal || '';
        this.impulsive = selfharm.impulsive || '';
        this.accidential = selfharm.accidential || '';
        this.disability = selfharm.disability || '';
        this.final = selfharm.final || '';
        this.consequences = selfharm.consequences || '';
        this.preattempt = selfharm.preattempt || '';
        this.attempt = selfharm.attempt || '';
        this.otherward = selfharm.otherward || '';
        this.illness = selfharm.illness || '';
        this.diagnoseill = selfharm.diagnoseill || '';
        this.treatment = selfharm.treatment || '';
        this.lifeevents = selfharm.lifeevents || '';
        this.otherlife = selfharm.otherlife || '';
        this.sexualabuse = selfharm.sexualabuse || '';
        this.datedischarge = selfharm.datedischarge || '';
        this.wardday = selfharm.wardday || '';
        this.maindiagnosis = selfharm.maindiagnosis || '';
        this.external = selfharm.external || '';
        this.othermx = selfharm.othermx || '';
        this.support = selfharm.support || '';
        this.othersupport = selfharm.othersupport || '';
        this.therapy = selfharm.therapy || '';
        this.othertherapy = selfharm.othertherapy || '';
        //this.status = selfharm.status || '';

    }
}
