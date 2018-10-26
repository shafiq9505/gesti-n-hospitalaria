import { FuseUtils } from '../../../core/fuseUtils';
import { StringLike } from '@firebase/util';

export class medication
{
    
    id : string ;
    name : string;
    dosage: string ;
    duration : string;
    frequency : String;
    duration_unit : String ; 
    date : string;
    patientName : string;
    route : string;
    doctorName: string;

    constructor(med)
    {
        {
          
            //medication part
            this.id = med.id || FuseUtils.generateGUID();
            this.name = med.name || '';
            this.dosage = med.dosage || '';
            this.frequency = med.frequency || '';
            this.duration = med.duration || '';
            this.duration_unit = med.duration_unit || '';
            this.date = med.date || new Date().getDate();
            this.patientName = med.patientName || '';
            this.route = med.route || '';
            this.doctorName = med.doctorName || '';
        }
    }
}
