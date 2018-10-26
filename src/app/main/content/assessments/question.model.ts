import { FuseUtils } from '../../../core/fuseUtils';

export class Question
{
    id: string;
    title: string;
    note: string;

    constructor(question)
    {
        {
            this.id = question.id || FuseUtils.generateGUID();
            this.title = question.title || '';
            this.note = question.note || '';
        }
    }
}
