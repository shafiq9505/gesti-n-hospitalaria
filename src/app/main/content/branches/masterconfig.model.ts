import { FuseUtils } from '../../../core/fuseUtils';

export class MasterConfig{
    category : string
    id : string
    constructor(category)
    {
        {
            this.id = category.id || FuseUtils.generateGUID();
            this.category = category.category || '';
        }
    }
}
