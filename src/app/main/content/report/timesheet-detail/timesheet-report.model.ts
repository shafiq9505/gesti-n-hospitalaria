import { FuseUtils } from '../../../../core/fuseUtils';
export class TimesheetReport
{
    id: string;
    guid:string;
    activity:string;
    startTime:string;
    endTime:string;
    totalPeriod:string;

    constructor(ts){
        this.id = ts.id || FuseUtils.generateGUID();
        this.guid = ts.guid || '';
        this.activity = ts.activity || '';
        this.startTime = ts.startTime || '';
        this.endTime = ts.endTime || '';
        this.totalPeriod = ts.totalPeriod || '';
    }
}