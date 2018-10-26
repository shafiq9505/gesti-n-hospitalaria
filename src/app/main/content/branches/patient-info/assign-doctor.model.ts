import { FuseUtils } from '../../../../core/fuseUtils';

export class AssignDoctor {
    guid: string;
    date: string;
    patientId: string;
    status: string;

    constructor(followup) {
        this.guid = followup.guid || '';
        this.date = followup.date || '';
        this.patientId = followup.patientId || '';
        this.status = followup.status || '';
    }
}