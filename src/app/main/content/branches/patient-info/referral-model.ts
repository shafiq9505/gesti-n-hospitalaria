import { FuseUtils } from '../../../../core/fuseUtils';
// import { ReferPatientDialogComponent } from '../refer-patient-dialog/refer-patient-dialog.component';

export class Referral {
    referralId: string;
    dateAdmitted: string;
    dateDiscard: string;

    doc_title?: string;
    doc_name?: string;
    doc_department?: string;
    loct_name?: string;
    loct_address?: string;
    loct_postcode?: string;
    loct_city?: string;
    loct_state?: string;

    reasons?: string;
    problems?: string;
    history?: any;
    examination?: any;
    investigation? : string;
    summary?: string;
    comments?: string;
    pdf_referral_id: string;
    referral_type: string;
    
    constructor( referral ){
        this.referralId = referral.guid || FuseUtils.generateGUID();
        this.dateAdmitted = referral.dateAdmitted || '';
        this.dateDiscard = referral.dateDiscard || '';

        // this.doc_title = referral.doc_title || '';
        this.doc_name = referral.doc_name || '';
        this.doc_department = referral.doc_department || '';
        this.loct_name = referral.loct_name || '';
        this.loct_address = referral.loct_address || '';
        this.loct_postcode = referral.loct_postcode || '';
        this.loct_state = referral.loct_state || '';

        this.reasons = referral.reasons || '';
        this.problems = referral.problems || '';
        this.history = referral.history || '';
        this.examination = referral.examination || '';
        this.investigation = referral.investigation || '';
        this.summary = referral.summary || '';
        this.comments = referral.comments || '';
        this.pdf_referral_id = FuseUtils.generateGUID();
        this.referral_type = '';
    }
}
