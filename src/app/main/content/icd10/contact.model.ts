import { FuseUtils } from '../../../core/fuseUtils';
import { StringLike } from '@firebase/util';

export class icd10
{
    
    id : string ;
    classification : string;
    code: string ;
    category : string ; 

    constructor(data)
    {
        {
          
            //medication part
            this.id = data.id || FuseUtils.generateGUID();
            this.classification = data.classification || '';
            this.code = data.code || '';
            this.category = data.category || '';
        }
    }
}
