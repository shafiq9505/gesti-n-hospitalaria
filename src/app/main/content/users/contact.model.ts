import { FuseUtils } from '../../../core/fuseUtils';

export class Contact
{
    id: string;
    uid: string; //firebase auth uid
    guid: string;
    name: string;
    lastName: string;
    avatar: string;
    nickname: string;
    company: string;
    jobTitle: string;
    email: string;
    phone: string;
    address: string;
    birthday: string;
    notes: string;
    password: string;
    role : string;
    branch : string;
    branchGUID: string;
    doctorType: string;
    created: String;
    constructor(contact?)
    {
        {
            this.id = contact.id || FuseUtils.generateGUID();
            this.guid = contact.guid || '';
            this.name = contact.name || '';
            this.lastName = contact.lastName || '';
            this.avatar = contact.avatar || 'assets/images/avatars/profile.jpg';
            this.nickname = contact.nickname || '';
            this.company = contact.company || '';
            this.jobTitle = contact.jobTitle || '';
            this.email = contact.email || '';
            this.phone = contact.phone || '';
            this.address = contact.address || '';
            this.birthday = contact.birthday || '';
            this.notes = contact.notes || '';
            this.password = contact.password || '';
            this.role = contact.role || '';
            this.branch = contact.branch || '';
            this.branchGUID = contact.branchGUID || '';
            this.doctorType = contact.doctorType || '';
            this.created = new Date().toLocaleDateString();
        }
    }
}
