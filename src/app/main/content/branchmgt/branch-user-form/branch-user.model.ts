import { FuseUtils } from '../../../../core/fuseUtils';

export class BranchUsers
{
  id: string;
  name: string;
  address: string;
  city: string;
  postcode: string;
  state: string;
  phone: string;
  faxno: string;

    constructor(user)
    {
        {
          this.id = user.id || FuseUtils.generateGUID();
          this.name = user.name || '';
          this.address = user.address || '';
          this.city = user.city || '';
          this.postcode = user.postcode || '';
          this.state = user.state || '';
          this.phone = user.phone || '';
          this.faxno = user.faxno || '';
        }
    }
}
