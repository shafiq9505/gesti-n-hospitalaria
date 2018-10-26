import { FuseUtils } from '../../../../core/fuseUtils'

export class Visit {

    guid      : string;
    date    : string;
    chiefofcomplaints: string;
    systolic:string;
    diastolic: string;
    height  : string;
    weight  : string;
    pulserate: string;
    visittext: string;
    complete: boolean;
    collection: string;    
    doctor: string;

    constructor(visit)
    {
        visit = visit || {};
        this.guid = visit.guid || FuseUtils.generateGUID();
        this.date = visit.date || '';
        this.chiefofcomplaints = visit.chiefofcomplaints || '';
        this.systolic = visit.systolic || '';
        this.diastolic = visit.diastolic || '';
        this.height = '' || visit.height;
        this.weight = '' || visit.weight;
        this.pulserate = '' || visit.pulserate;
        this.visittext = '' || visit.visittext;
        this.complete = ''  || visit.complete;
        this.collection = '' || visit.collection;
        this.doctor = '' || visit.doctor;
    }
}
