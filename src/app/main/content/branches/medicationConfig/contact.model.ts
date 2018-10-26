import { FuseUtils } from '../../../../core/fuseUtils';
import { StringLike } from '@firebase/util';

export class medicationConfig
{
    id : string 
    name : string
    route : string
    type : string;
    
    constructor(Config)
    {
        {

            this.id    = Config.guid || FuseUtils.generateGUID();
            this.name = Config.name || '';
            this.route = Config.route || '';
            this.type = Config.type || '';
        }
    }
}
