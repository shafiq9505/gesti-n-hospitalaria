import { FuseUtils } from '../../../core/fuseUtils';

export class Card
{
    id: string;
    name: string;
    description: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    scale: number;
    type: number;

    idAttachmentCover: string;
    idMembers: string[];
    idLabels: string[];
    attachments: any[];
    subscribed: boolean;
    checklists: any[];
    checkItems: number;
    checkItemsChecked: number;
    comments: any[];
    activities: any[];
    due: string;
    itemRows: any[];

    constructor(card)
    {
        this.id = card.id || FuseUtils.generateGUID();
        this.name = card.name || '';
        this.description = card.description || '';
        this.option1 = card.option1 || '';
        this.option2 = card.option2 || '';
        this.option3 = card.option3 || '';
        this.option4 = card.option4 || '';
        this.scale = card.scale || '';
        this.type = card.type || '';

        this.idAttachmentCover = card.idAttachmentCover || '';
        this.idMembers = card.idMembers || [];
        this.idLabels = card.idLabels || [];
        this.attachments = card.attachments || [];
        this.itemRows = card.itemRows || [];
        this.subscribed = card.subscribed || true;
        this.checklists = card.checklists || [];
        this.checkItems = card.checkItems || 0;
        this.checkItemsChecked = card.checkItemsChecked || 0;
        this.comments = card.comments || [];
        this.activities = card.activities || [];
        this.due = card.due || '';
    }


}
