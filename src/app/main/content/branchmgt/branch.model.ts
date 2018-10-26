import { FuseUtils } from '../../../core/fuseUtils';

export class Branch
{
  id: string;
  guid: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  state: string;
  phone: string;
  faxno: string;
  startdate: string;
  isMainBranch: boolean;

  constructor(branch)
  {
    this.id = branch.id || FuseUtils.generateGUID();
    this.guid = branch.guid || '';
    this.name = branch.name || '';
    this.address = branch.address || '';
    this.city = branch.city || '';
    this.postcode = branch.postcode || '';
    this.state = branch.state || '';
    this.phone = branch.phone || '';
    this.faxno = branch.faxno || '';
    this.startdate = branch.startdate || '';
    this.isMainBranch = branch.isMainBranch || false;
  }
}
