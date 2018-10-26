import { FuseUtils } from '../../../core/fuseUtils';

export class Template
{
    id : string;
    guid: string;
    title: string;
    text: string;
    category: string;

    constructor(template)
    {

          this.id = template.id || FuseUtils.generateGUID();
          this.guid = template.guid || '';
            this.title = template.title || '';
            this.text = template.text || '';
            this.category = template.category || '';


    }
}
