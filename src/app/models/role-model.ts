export enum Role {
    superUser = 1,
    purchaser = 2,
    hrAdmin = 3,
    manager = 4,
    user = 5
}

export enum OfferStatus {
    pendingMatch = 0,
    hrApproval = 1,
    scheduleUpdated = 2,
    rejected = 3,
    available = 4,
    pendingProceed = 5,
    proceed = 6,
    accepted = 7,
    expired = 8,
    notinterested = 9
}

export class RolePopup {
    userrole: string;
}
// export enum TransferStatus {
//     pendingHrApproval = 0,
//     hrApproved = 1,
//     denied = 2,
//     accepted = 3,
//     notinterested = 4,
//     expired = 5,
//     processed = 6,
// }