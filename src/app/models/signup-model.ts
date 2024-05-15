export class SignUpMessageList {
    companyId: string;
    locationId: string;
    departmentId: string;
    shiftId: string;
    name: string;
    phoneNumber: string;
    email: string;
    companyUserName: string;
    employeeId: string;
    password: string;
    confirmPassword: string;
    roleId: number;
}

export class User {
    userId: number;
    emailId: string;
    password: string;
    name: string;
    vCode: string;
    companyId: number;
    departmentId: number;
    subDepartmentId:number;
    locationId: number;
    isRecievingTextMessage: true;
    phone: string;
    companyUsername: string;
    employeeId: number;
    roleId: number;
    shiftId: number;
    isActive: true;
    communicationMethodEnum: [];
    GetCommunicationMethod: string[];
    Roles: number;
    roleIdEnum: [];
    GetRoleId: string[];
}