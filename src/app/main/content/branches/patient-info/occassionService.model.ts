import { FuseUtils } from '../../../../core/fuseUtils';

export class OccassionService {
    id: string;
    location: string;
    category: string;
    status: string;
    minutes:string;
    hours: string ;
    outcome:string;
    complexity: string;
    name: string

    constructor(ocs) {
        this.id = ocs.id || FuseUtils.generateGUID();
        this.location = ocs.location || '';
        this.hours = ocs.hours || '';
        this.category = ocs.category || '';
        this.status = ocs.status || '';
        this.minutes = ocs.minutes || '';
        this.outcome = ocs.outcome || '';
        this.complexity = ocs.complexitys || '';
        this.name = ocs.name || '';
    }
}