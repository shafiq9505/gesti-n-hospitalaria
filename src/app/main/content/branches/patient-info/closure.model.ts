import { FuseUtils } from '../../../../core/fuseUtils'

export class Closure {

  guid: string;
  checklist: string;
  followup: string;
  reasonofclosure: string;
  comment: string;
  casesummary: string;

  constructor(closure) {

    closure              = closure || {};
    this.guid            = closure.guid || FuseUtils.generateGUID();
    this.checklist       = closure.checklist || '';
    this.followup        = closure.followup || '';
    this.reasonofclosure = closure.reasonofclosure || '';
    this.comment         = closure.comment || '';
    this.casesummary     = closure.casesummary || '';
  }

}
