import { FuseUtils } from '../../../core/fuseUtils';

export class List
{
    id: string;
    name: string;
    idCards: string[];
    ismodule: boolean;
    issubjective: boolean;
    ismcq: boolean;
    ismetered: boolean;
    ischeckbox: boolean;

    constructor(list,name)
    {
        this.id = list.id || FuseUtils.generateGUID();
        this.name = name || '';
        this.idCards = [];
        this.ismodule = false;
        this.issubjective = false;
        this.ismcq = false;
        this.ismetered = false;
        this.ischeckbox = false;
    }
}
