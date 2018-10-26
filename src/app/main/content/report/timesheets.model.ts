import { FuseUtils } from '../../../core/fuseUtils';

export class Timesheet{

    guid:string;
    id: string;
    uid: string;
    branchguid: string;
    from: string;
    to: string;
    totalHours: string;
    
    constructor(ts){
        this.guid = ts.guid || '';
        this.id = ts.id || FuseUtils.generateGUID();
        this.uid = ts.uid || '';
        this.branchguid = ts.branchid || '';
        this.from = ts.from || '';
        this.to = ts.to || '';
        this.totalHours = ts.totalHours || '';
    }
}