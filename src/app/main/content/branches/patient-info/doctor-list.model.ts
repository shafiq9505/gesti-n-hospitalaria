import { FuseUtils } from '../../../../core/fuseUtils';

export class DoctorList {

    address: string;
    birthday: string;
    branch: string;
    branchGUID: string;
    email: string;
    id: string;
    lastName: string;
    name: string;
    password: string;
    phone: string;
    role: string;
    uid: string;

    constructor(doctor){
        this.address = doctor.address;
        this.birthday = doctor.birthday;
        this.branch = doctor.branch;
        this.branchGUID = doctor.branchGUID;
        this.email = doctor.email;
        this.id = doctor.id
        this.lastName = doctor.lastName;
        this.name = doctor.name;
        this.password = doctor.password;
        this.phone = doctor.phone;
        this.role = doctor.role;
        this.uid = doctor.uid;
    }
}