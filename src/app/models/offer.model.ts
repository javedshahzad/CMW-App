export class Offer {
    offerId: number;
    dateToSkip: Date;
    dateToWork: Date;
    departmentId: number;
    shiftToSkip: number;
    shiftToWork: number;
    companyId: number;
    status: number;
    createdBy: string;
    createdDate: string;
    timeType: number;
    vtoStartTime: string;
    vtoEndTime: string;
    vtoType: number;
    vtoCount: number;
    isVtoSms: boolean;
    ReasonId : string;
    OtherReason : string;
    IsFMLA:boolean;
    IsHRCallBack:boolean;
    IsPaidOff:boolean;
    IsFMlA:boolean;
    uTOHours : number;
    isUtoBalance:boolean;
    isWarningCompleted:boolean;
    approvedBy:number;
    approvedDate:string;
    offerType:number;
    UTOwarningStr: string;
    FlexWorkType: number;
    preferenceId:number;
    isPit:boolean;
    subDepartmentId:number;
    startDate:Date;
    reason:string;
    isHourEarly:boolean;
    isHourLate:boolean;
    hourValue:string;
    startdateTime: string;
    IsDateCrossOver:boolean;
    PunchTime: Date;
    PunchType: number;
    TimePunchesId: number;
}

export class VtoOffer {
    offerId: number;
    departmentId: number;
    date: Date;
    startTime: string;
    endTime: string;
    noOfUsers: number;
}
export class EarlyGoOffer {
    date: Date;
    startTime: string;
    endTime: string;
    reason:string;
    utoHours:string;
}
export class TransferOffer {
    departmentId:number;
    subDepartmentId:number;
    shiftToWork:number;
	preferenceId:number;
	isPit:boolean;
}

export class LateInOffer {
    date: Date;
    startTime: string;
    endTime: string;
    reason:string;
    utoHours:string;
}

export class WorkHours {
    WeekEndDate: Date;
    WeekStartDate: Date;
}
export class IssueReportModel{
    Subject: Number;
    Body: string;
}