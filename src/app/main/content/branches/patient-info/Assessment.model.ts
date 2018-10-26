import { FuseUtils } from '../../../../core/fuseUtils';

export class Assessment
{
  guid : string;
  doctor_name : string;
  type : string;
  result: string;
  session_name: string;
  when: Date;
  
    constructor(assessment?)
    {
        //assessment = assessment || {};
        this.guid      = assessment.guid || FuseUtils.generateGUID();
        this.doctor_name    = assessment.doctor_name || '';
        this.type    = assessment.type || '';
        this.result = assessment.result || '';
        this.session_name= assessment.session_name || '';
        this.when = assessment.when || new Date();
    }
}
