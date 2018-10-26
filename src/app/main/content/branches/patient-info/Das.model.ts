import { FuseUtils } from '../../../../core/fuseUtils';

export class Das
{
  guid : string;
  question : string;
  type : string;
  idx : string;
  
    constructor(das?)
    {
        //das = das || {};
        this.guid      = das.guid || FuseUtils.generateGUID();
        this.question    = das.question || '';
        this.type    = das.type || '';
        this.idx    = das.idx || '';
    }
}
