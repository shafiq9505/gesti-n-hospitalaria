import { FuseUtils } from '../../../../core/fuseUtils';

export class BranchInfo
{
  id      : string;
  name    : string;
  address : string;
  postcode: string;
  city    : string;
  state   : string;
  phone   : string;
  faxno   : string;
  team    : any[];
  users   : any[];
  status  : any[];

    constructor(branchinfo?)
    {
        branchinfo = branchinfo || {};
        this.id      = branchinfo.id || FuseUtils.generateGUID();
        this.name    = branchinfo.name || '';
        this.address = branchinfo.address || '';
        this.postcode= branchinfo.postcode || '';
        this.city    = branchinfo.city || '';
        this.state   = branchinfo.state || '';
        this.phone   = branchinfo.phone || '';
        this.faxno   = branchinfo.faxno || '';
        this.team    = branchinfo.team || [];
        this.users   = branchinfo.users || [];
        this.status  = branchinfo.status || [];

    }
}
