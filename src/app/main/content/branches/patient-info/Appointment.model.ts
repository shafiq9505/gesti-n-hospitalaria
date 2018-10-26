import { FuseUtils } from '../../../../core/fuseUtils'

export class Appointment {
    
    guid : string;
    title: string;
    start: string;
    end: string;
    doctor:string;
    color: {};
    meta: {};
    doctorGUID: string;
    doctorName: string;
    hourStart: string;
    hourEnd: string;
    
    constructor(visit)
    {
        //visit = visit || {};
        this.guid = visit.guid || '',
        this.title = visit.title || '';
        this.start = visit.start || '';
        this.end = visit.end || '';
        this.doctor = visit.doctor || '';
        this.hourStart = visit.hourStart || '';
        this.hourEnd = visit.hourEnd || '';
        this.color = {
            primary: '#1e90ff',
            secondary: '#D1E8FF'
        };
        this.meta = {
            location: visit.location || '',
            notes: visit.notes || ''
        }
        this.doctorGUID = visit.doctorGUID || '';
        this.doctorName = visit.doctorName || '';
    }
    
}