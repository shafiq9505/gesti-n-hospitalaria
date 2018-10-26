import { FuseUtils } from '../../../core/fuseUtils';
import { StringLike } from '@firebase/util';

export class masterconfig
{

    // id : string ;
    // name : string;
    // dosage: string ;
    // duration : string;
    // frequency : String;
    // duration_unit : String ;
    reason1 :string;
    reason2 :string;
    reason3 :string;
    reason4 :string;
    id : string ;
    category: string;


    constructor(contact)
    {
        {

            //medication part
            // this.id = contact.id || FuseUtils.generateGUID();
            // this.name = contact.name || '';
            // this.dosage = contact.dosage || '';
            // this.frequency = contact.frequency || '';
            // this.duration = contact.duration || '';
            // this.duration_unit = contact.duration_unit || '';
            this.reason1 = contact.reason1 || '';
            this.reason2 = contact.reason2 || '';
            this.reason3 = contact.reason3 || '';
            this.reason4 = contact.reason4 || '';
            this.id    = contact.guid || FuseUtils.generateGUID();
            this.category = contact.category || '';
        }
    }
}
