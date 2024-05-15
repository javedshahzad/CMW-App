export const Constants = {
  CURRENT_PAGE: 1,
  ROWS_ON_PAGE: 50,
  HR_PAGE_ROWS_ON_PAGE: 100,
  API_URL: "API_URL",
  CMW_ROLE: "CMW_ROLE",
  CMW_USER: "CMW_USER",
  IS_SWAP: 'isSwap',
  IS_VOT: 'isVot',
  TOKEN: 'access_token',
  PRICINGID: 'pricingId',
  USERID: 'userId',
  SHIFTID: 'shiftId',
  OFFLINE_MSG: "Please check your internet connection",
  MANAGER_OFFER_DISCLAIMER: ` I understand that I am creating a solo opportinuty to for team members to take advantage of. If this offer was to be accepted by a team member. It will have net effect on expected head count on skip date as this is a solo swap. I understand Coverage Catch allows managers to create this type of dummy offers to balance staffing needs based on seasonality of your business. I understand that creating too many of these opportunities may shift the headcount balance too far but I have reviewed the business need.`,
  DISCLAIMER: 'Disclaimer',
  HR_TERMS_AND_CONDITION_OFFER_TEXT: 'I agree to the following terms to the offer',
  DELETE_MSG: "Are you sure you want to Delete ?",
  IACCEPT_MSG: "Are you sure you want to Accept ?",
  DEPARTMENTID: 'departmentId',
  LOCATIONID: 'loationId',
  ROLE: 'role',
  YES: "Yes",
  NO: "No",
  PENDING_CONFIRM_BTN_TEXT: "Confirm",
  PENDING_CANCEL_BTN_TEXT: "Cancel",
  REJECT_MSG: "Are you sure you want to reject ?",
  TRANSFER_REQUEST_DENY_MSG: "Transfer request denied successfully!",
  TRANSFER_REQUEST_APPROVE_MSG: "Transfer Request approved successfully!",
  TRANSFER_REQUEST_PROCESS_MSG:
  "Transfer Request request processed successfully!",
  APPROVE_MSG: `By approving this request, you are confirming that you have adjusted related employee’s work schedules in your inhouse time keeping system (KRONOS or other). CMW does not interact with your scheduling system currently therefore manual schedule adjustment is necessary right before approving requests. An email/text will be sent to employee as soon as you click confirm.`,
  APPROVE: true,
  USERNAME: 'userName',
  PHONENUM: 'PhoneNumber',
  RETURNING_COMPANYID: 'returning-companyID',
  IDENTIFIER: 'identifier',
  COMPANYID: 'AppCompanyId',
  APPCOMPANYID: 'companyId',
  IS_TRANSFER: 'isTransfer',
  IS_TRAINING: 'isTraining',
  IS_VTO: 'isVto',
  IS_CALL_OFF: 'isCallOff',
  IS_EARLY_OUT: 'isEarlyOut',
  IS_FLEX_WORK: 'isFlexWork',
  IS_SWAP_REQUEST: 'isSwapRequests',
  IS_VOT_REQUEST: 'isVOTRequests',
  IS_TRANSFER_REQUEST: 'isTransferRequests',
  IS_TRAINING_REQUEST: 'isTrainingRequests',
  IS_TERMS_UPDATE: 'isTermsUpdated',
  IS_VTO_REQUEST: 'isVtoRequest',
  IS_FLEX_WORK_REQUEST: 'isFlexWorkRequest',
  IS_CALL_IN_REQUEST: 'isCallInRequest',
  IS_EARLY_GO_REQUEST: 'isEarlyGoRequest',
  IS_TIME_OFF_REQUEST: "isTimeOffRequests",
  IS_CLOCK_IN_OUT: "isCheckInOut",
  IS_CLOCK_IN_OUT_REQUEST: "isCheckInOutRequest",
  IS_TIME_OFF: "isTimeOff",
  IS_LATE_IN_REQUEST: "isLateInRequest",
  IS_LATE_IN: "isLateIn",
  VOT_REQUEST_APPROVE_MSG: "VOT request approved successfully!",
  VOT_REQUEST_DENIED_MSG: "VOT request denied successfully!",
  NO_INTERNET_CONNECTION_MSG: 'No internet connection!',
  VTO_REQUEST_PROCESS_SUCCESS_MSG: "VTO request accepted successfully!",
  OFFER_DELETE_SUCCESS_MSG: 'Request deleted successfully!',
  CLOCK_IN_OUT_REQUEST_ADD_SUCCESS_MSG: 'Punch added successfully!',
  CLOCK_IN_OUT_NO_CHANGE_DETECTED: 'No change detected! Request is not saved',
  CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG3:'Your device registration is corrupted. Contact your HR Admin to reset the token and try again.',
  CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG2:'device must be registered to use clock-in/out function.',
  CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG1:'Another device is registered for this account. Contact your HR Admin to reset the token',
  CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG: 'Your device must be registered for using clock-in/out feature of the App.',
  CLOCK_IN_OUT_REQUEST_ENABLE_MSG: 'Your employer has not enabled mobile clock-in/out. You can view your time punches here though.',
  CLOCK_IN_OUT_REQUEST_GEOLOCATIONErr: "Time punch failed. Please grant access to location service through your device settings",
  CLOCK_IN_OUT_REQUEST_Permissions: "Time punch required GPS and Location permission. Please grant access to location service through your device settings",
  DEVICE_NOT_SUPPORTED_COARSE: "Your device is not supported",
  CALL_OFF_REQUEST_ADD_SUCCESS_MSG: 'Call-Off request added successfully!',
  CALL_OFF_REQUEST_UPDATE_SUCCESS_MSG: 'Call-Off request updated successfully!',
  COMPANY_CHANGE_CONFIRM_MSG: 'Are you sure you want to change the company',
  CALL_OFF_REQUEST_APPROVE_MSG: "Call-Off request processed successfully!",
  FLEX_REQUEST_PROCESS_SUCCESS_MSG: "Flex request processed successfully!",
  FLEX_REQUEST_DELETE_SUCCESS_MSG: "Flex request deleted successfully!",
  CALL_OFF_REASON_ADD_MSG: "Call-Off reason added successfully!",
  CALL_OFF_REASON_EDIT_MSG: "Call-Off reason updated successfully!",
  OFFER_MSG_WHILE_COMPANY_CHANGE: 'Your account found created pending offers, If you wish to change company then all will be removed. Are you sure to change company?',
  PROFILE_SUCCESS_MSG: 'Profile updated successfully!',
  VTO_REQUEST_ADD_SUCCESS_MSG: 'Vto request added successfully!',
  VTO_REQUEST_UPDATE_SUCCESS_MSG: 'Vto request updated successfully!',
  SHIFT_START_TIME_CONFIGURE: 'Please configure sencond half start time in shift',
  SHIFT_END_TIME_CONFIGURE: 'Please configure first half end time in shift',
  VOT_REQUEST_ADD_MSG: 'VOT request added successfully!',
  VOT_REQUEST_UPDATE_MSG: 'VOT request updated successfully!',
  EARLY_OUT_REQUEST_UPDATE_SUCCESS_MSG:
    "Early-Out request updated successfully!",
  EARLY_OUT_REQUEST_PROCESS_SUCCESS_MSG:
    "Early-Out request processed successfully!",
  EARLY_OUT_REQUEST_ADD_SUCCESS_MSG: "Early-Out request added successfully!",
  FLEX_REQUEST_ACCEPT_SUCCESS_MSG: "Flex request accepted successfully!",
  TIME_OFF_REQ_ADD_MSG: "Time-Off Request added successfully!",
  TIME_OFF_REQ_EDIT_MSG: "Time-Off Request updated successfully!",
  TIME_OFF_REQ_DELETE_MSG: "Time-Off Request deleted successfully!",
  TIME_OFF_REQUEST_APPROVE_MSG: "Time-Off Requests approved successfully!",
  TIME_OFF_REQUEST_REJECT_MSG: "Time-Off Requests denied successfully!",
  TIME_PUNCHES_APPROVE_MSG: "Time Punches approved successfully!",
  TIME_PUNCHES_REJECT_MSG: "Time Punches denied successfully!",
  NO_AVAILABLE_SHIFT: "User is not working on selected date",
  USER_WORKING_ON_SKIP_Date: "User is already working on selected work on date",
  VALID_WORK_ON_DATE: "Select valid date to work on",
  APP_NAME: 'appName',
  LOGO_PATH: 'logoPath',
  LOGIN_URL: 'loginUrl',
  WEB_URL: 'webUrl',
  COMPANY_NOT_EXIST_MSG: 'Company not available',
  OFFER_ACCEPT_MSG: 'Offer accepted successfully!',
  SERVERIDENTIFIER:'serverIdentifier',
  TIME_PUNCH_DATA:'Time_Punch_Data',
  VOT_DATA: 'Vot_Data',
  CALL_IN_DATA: 'Call-in_Data',
  IS_Profile_call: 'isProfileFirstTime',
  EARLY_OUT_DATA: 'Early_out_data',
  FLEX_WORK_DATA: 'Flex_work_data',
  TIME_OFF_DATA: 'Time_off_data',
  VTO_DATA: "vto_data",
  SWAP_DATA: "Swap_data",
  LATE_IN_DATA: 'Late_in_data',
  LATE_IN_REQUEST_UPDATE_SUCCESS_MSG:
    "Late-In request updated successfully!",
  LATE_IN_REQUEST_PROCESS_SUCCESS_MSG:
    "Late-In request processed successfully!",
  LATE_IN_REQUEST_ADD_SUCCESS_MSG: "Late-In request added successfully!",
  DEVICETOKEN:"token",
  DEVICETYPE:"devicetype",
  OFFER_APPROVE_SUCCESS_MSG: "Offer approved successfully!",
  OFFER_REJECT_SUCCESS_MSG: "Offer rejected successfully!",
  REGEX: {
    EMAIL_PATTERN: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
    PASSWORD_PATTERN: new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,16}$/,
    ),
    PHONE_PATTERN: new RegExp(/^([0-9]{10,10})$/),
    DECIMAL_PATTRN: new RegExp(/^\d*?(\.\d{1,2})?$/),
    INTEGER_PATTERN: new RegExp(/^[0-9]*$/),
    CHARACTER_PATTERN: new RegExp(/^[a-zA-Z ]*$/),
    ZIP_PATTERN: new RegExp(/^[0-9]{5}(?:-[0-9]{4})?$/),
    LIMIT_PATTERN: new RegExp(/^([1-9]|1[0-9]|2[0])$/),
    FLEX_LIMIT_PATTERN: new RegExp(/^([1-9]|[1-2-3-4][0-9]|5[0])$/)
  },

  VALIDATION_MSG: {
    DESCTIPTION_REQ: "UTO warning Message is Required",
    CHECK_CREDENTIALS: "Please check your credentials or select company",
    SIGN_UP: {
      COMPANY_REQUIRED: 'Company is required',
      LOCATION_REQUIRED: 'Location is required',
      DEPARTMENT_REQUIRED: 'Department is required',
      SHIFT_REQUIRED: 'Shift is required',
      NAME_REQUIRED: 'Name is required',
      EMAIL_REQUIRED: 'Email is required',
      USER_INVALID: 'User does not exist',
      EMAIL_INVALID: 'Email is not valid',
      PHONE_REQUIRED: 'Phone number is required',
      PHONE_INVALID: 'Phone number is not valid',
      COMPANY_NAME_REQUIRED: 'User name is required',
      EMPLOYEEID_REQUIRED: 'EmployeeId is required',
      PASSWORD_REQUIRED: 'Password is required',
      PASSWORD_INVALID: 'Password should contain 1 uppercase, 1 lowercase, 1 digit, 1 special character and minimum 6 and maximum 15 letter length!',
      CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
      PASSWORD_CONFIRM_PASSWORD_NOT_MATCH: `Password and Confirm password doesn't match!`,
      ROLE_REQUIRED: 'Role is required',
      COMMUNICATION_METHOD_REQUIRED: 'At least one communication method is required!'
    },
    ROLE: {
      USER_ROLE_REQUIRED: "User Role is required",
    },
    FORGOTPASSWORD: {
      EMAIL_REQUIRED: 'Email is required',
      EMAIL_SERVERDOWN: 'Email server down, Please try later'
    },

    SUB_DEPARTMENT: {
      DEPARTMENT_REQUIRED: 'Department  is required',
      SUB_DEPARTMENT_NAME_REQUIRED: 'Sub Department is required',
    },
    TRANSFER_APPROVE_REQUEST: {
      START_DATE_REQUIRED: "Start Date is required",
    },

    CHANGEPASSWORD: {
      CURRENT_PASSWORD_REQUIRED: 'Current Password is required',
      NEW_PASSWORD_REQUIRED: 'Password is required',
      PASSWORD_INVALID: 'Password should contain 1 uppercase, 1 lowercase, 1 digit, 1 special character and minimum 6 and maximum 15 letter length!',
      CONFIRM_PASSWORD_REQUIRED: 'Confirm password is required',
      PASSWORD_CONFIRM_PASSWORD_NOT_MATCH: `Password and Confirm password doesn't match!`,
    },
    DENIAL_REQUEST: {
      REASON_REQUIRED: "Reason is required",
    },
    FEEDBACK: {
      DESCRIPTION_REQUIRED: "Description is required",
      FEEDBACK_OPTION: "Please select one option"
    },
    OFFER: {
      SKIP_DATE_REQUIRED: 'I would like to skip date is required',
      WORK_ON_DATE_REQUIRED: 'I would like to work on date is required!',
      SKIP_SHIFT_REQUIRED: 'Offer to skip shift is required',
      WORK_OFFER_SHIFT_REQUIRED: 'Offer to work shift is required!',
      WORK_SHIFT_REQUIRED: 'Shift to work on is required',
      DEPARTMENT_REQUIRED: 'Department is required!',
      DATE_MSG: 'Date to work is not same as skip date!',
      DATE_MSG2: 'Date to skip is not same as work date!',
      TIME_TYPE_REQUIRED: 'Time is required!'
    },

    VTO: {
      NO_OF_USER: 'No. of users is required',
      END_TIME: 'End time is required!',
      START_TME: 'Departure time is required!',
      DATE: 'Date is required!',
      DEPARTMENT_ID: 'Department is required!',
      NO_Of_USER_PATTERN: 'No. of users between 1 to 20',
      SHIFT_ID: 'Shift is required',
      NO_Of_USER_FLEX_PATTERN: 'No. of users between 1 to 50',
    },

    CALL_IN: {
      Name: 'Name is required',
      CALL_OFF_FOR: 'Reason is required',
      CALL_OFF_ON: 'Call-off On is required',
      OTHER_REASON: 'Explain other reason is required',
      NO_Of_USER_PATTERN: 'No. of users between 1 to 20',
      SHIFT_ID: 'Shift is required',
      MODULE_REQ: 'Module is required',
      MSG_CONFIGURE: 'ERROR'
    },
    EARLY_GO: {
      END_TIME: "End time is required",
      START_TME: "Start time is required",
      DATE: "Date is required",
      REASON: "Reason is required",
      UTO_HOURS: "UTO hours is required",
      SELECT_A_OPTION: "Please select one option",
    },
    TIME_OFF_REQUEST: {
      TIME_OFF_TYPE: "Time-Off Type is required",
      TIME: "Time is required",
      START_TIME: "Time-Off Start Date is required",
      END_TIME: "Time-Off End Date is required",
      TOTAL_REQUESTED_HOURS: "Total Requested Hours is required",
      DURATION: "Duration is required",
    },

    LATE_IN: {
      END_TIME: "End time is required",
      START_TME: "Start time is required",
      DATE: "Date is required",
      REASON: "Reason is required",
      UTO_HOURS: "UTO hours is required",
      SELECT_A_OPTION: "Please select one option",
    },

    TIME_PUNCH: {
      PUNCH_TIME: "Punch Time is required",
      PUNCH_TYPE: "Punch Type is required",
      PUNCH_TIME_BYHRS: "Can not enter future time in Time punch",
      REASON: "Reason is required"
    },
    WORK_HOURS: {
      START_TIME: "Start Date is required",
      END_TIME: "End Date is required",
    }

  },
  EMAIL_ADD_SUCCESS_MSG: 'Please check your mail for reset the password!',
  COMPANY_NAME: 'companyName',
  TERMS_CONDITION: 'Terms & Condition',
  PRIVACY: 'Privacy Notice',
  BTN_TEXT: 'I agree',
  CANCLE_BTN_TEXT: `I don't agree`,
  PASSWORD_UPDATE_SUCCESS_MSG: 'Password updated successfully!',
  OFFER_ADD_SUCCESS_MSG: 'Offer added successfully!',
  OFFER_UPDATE_SUCCESS_MSG: 'Offer updated successfully!',
}

export const phoneMask = { mask: '{+1} 000-000-0000' };

export const drpSetting = {
  dropdownSettings: {
    singleSelection: false,
    idField: 'id',
    textField: 'text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: false
  }
};



export enum ContentEnum {
  TNC = 1,
  PrivacyPolicy = 2
}

export const typeField =
  [{ id: 1, typeValue: 'Schedule Adjust' }, { id: 2, typeValue: 'Offer Terms and conditions' }, { id: 3, typeValue: 'Manager declaimer' }, { id: 4, typeValue: 'VOT request' }, { id: 5, typeValue: 'UTO Warning' }]

export const dropdownList = [{ id: 1, text: 'Email' }, { id: 2, text: 'Text Message' }];

export const vtoType = {
  instant: 1,
  managerOffer: 2,
  myRequest: 3
};

export const vtoTimeList = [
  { id: 1, value: 'Full day' },
  { id: 2, value: 'First half' },
  { id: 3, value: 'Second half' }]

export const timeList = [
  { id: 1, value: 'Full day' },
  { id: 2, value: 'First half' },
  { id: 3, value: 'Second half' },
  { id: 4, value: 'An hour early' },
  { id: 5, value: 'An hour late' }]


export const bsConfig = {
  dateInputFormat: 'MM-DD-YYYY',
  containerClass: 'theme-blue',
  showWeekNumbers: false,
  selectFromOtherMonth: true,
}
export const bsConfig_withMinDate = {
  dateInputFormat: "MM-DD-YYYY",
  containerClass: "theme-blue",
  showWeekNumbers: false,
  selectFromOtherMonth: true,
  minDate: new Date()
};
export const SubscriptionType = [
  { id: 1, value: 'Shift Swap Module' },
  { id: 2, value: 'VOT Request Module' },
  { id: 3, value: 'Transfer Request Module' },
  { id: 4, value: 'Training Request Module' },
  { id: 5, value: 'VTO Module' },
  { id: 6, value: 'Call-Off Module' },
  { id: 7, value: 'Early Out Module' },
  { id: 8, value: 'Flex Work Module' }
];

export enum OfferTypesEnum {
  AllModule = 0,
  ShiftSwapModule = 1,
  VOTRequestModule = 2,
  TransferRequestModule = 3,
  TrainingRequestModule = 4,
  VTOModule = 5,
  CallOffModule = 6,
  EarlyOutModule = 7,
  FlexWorkModule = 8,
  TimeKeepingModule = 9,
  LateInModule = 10,
  ClockInOutModule = 11
}

export enum OfferRequestTypesEnum {
  "All Request" = 0,
 "Swap Request" = 1,
  "VOT Request" = 2,
  "Transfer Request" = 3,
  //"Training Request" = 4,
  "VTO Request" = 5,
  "Call-Off Request" = 6,
  "Early Out Request" = 7,
  "Flex Work Request" = 8,
  "Time-Off Request" = 9,
  "Late In Request" = 10,
 "Clock In/Out Request" = 11
}

export enum OfferListEnum {
  "All Request" = 0,
 "Swap Request" = 1,
  "VOT Request" = 2,
  "Transfer Request" = 3,
  "VTO Request" = 5,
  "Call-Off Request" = 6,
  "Early Out Request" = 7,
  "Flex Work Request" = 8,
  "Time-Off Request" = 9,
  "Late In Request" = 10,
  "Punch Edit" = 11
}

export enum StatusTypesEnum {
  "All Status" = 0,
 "Pending Request" = 1,
  "Close Request" = 2,
}
export const Duration = [
  { id: 1, value: "Full Day" },
  { id: 2, value: "First Half" },
  { id: 3, value: "Second Half" },
  { id: 4, value: "Specific Times" },
];

export const SourceEnum = [
  { id: 1, value: "Mobile" },
  { id: 2, value: "Kiosk" },
];

export const ComplianceEnum = [
  { id: 1, value: "OnTime" },
  { id: 2, value: "Late" },
  { id: 3, value: "Early" },
  { id: 4, value: "UnScheduled" }, 
  ];

  
export const roleList = [
  { id: 1, role: "Admin" },
  { id: 2, role: "Purchaser" },
  { id: 3, role: "HrAdmin" },
  { id: 4, role: "Manager" },
  { id: 5, role: "User" },
  { id: 6, role: "LearningAdmin" },
];

export const PunchTypeEnum = [
  { id: 1, value: "ClockIn" },
  { id: 2, value: "ClockOut" },
];

export const loginRoleList = [
  // { id: 2, role: "purchaser", value: "Continue as Purchaser"},
  { id: 3, role: "HrAdmin", value: "Continue as HrAdmin"},
  // { id: 4, role: "Manager", value: "Continue as Manager" },
  // { id: 6, role: "LearningAdmin", value: "Continue as Learning Admin"},
  { id: 5, role: "User", value: "login as an end-user" },
];

  export const MenuListHr = [
    // { id: 1, image: '../../assets/svg/swap-icon.svg', label: 'SWAP requests',  },
    // { id: 2, image: '../../assets/svg/vot-icon-hr.svg', label: 'VOT requests' },
    // { id: 3, image: '../../assets/svg/vot-icon.svg', label: 'VTO requests'},
    // { id: 4, image: '../../assets/svg/calloff.svg', label: 'CALL-OFF requests'},
    // { id: 5, image: '../../assets/svg/early-out-requests.svg', label: 'EARLY OUT requests' },
    // { id: 6, image: '../../assets/svg/flex-work-icon.svg', label: 'FLEX WORK requests'},
    // { id: 7, image: '../../assets/svg/transfer-requests.svg', label: 'TRANSFER requests'},
    { id: 8, image: '../../assets/svg/off-timer02.svg', label: 'ALL-OFFER requests'},
    // { id: 9, image: '../../assets/svg/late-in.svg', label: 'LATE IN requests'}
];

export const DeviceTypeEnum = [
  { id: 1, value: "Android" },
  { id: 2, value: "IOS" }
];

export enum Role {
  superUser = 1,
  purchaser = 2,
  hrAdmin = 3,
  manager = 4,
  user = 5,
  learningAdmin = 6
}
export const SettingType = [
  //NOTE: Do check CommonSettingList in backend and update accordingly if you make any changes in this list 
  { id: 1, value: "PaidTimeOff" },
  { id: 2, value: "FMLA" },
  { id: 3, value: "Hour Early" },
  { id: 4, value: "Hour Late" },
  { id: 5, value: "VOT Cut-Off Hours" },
  { id: 6, value: "Call-off intervention" },
  { id: 7, value: "Early-out intervention" },
  { id: 8, value: "Early-Out UTO Message" },
  { id: 9, value: "UTO system for attendance" },
  { id: 10, value: "Lunchtime clock-in/out" },
  { id: 11, value: "Mobile check-in/out permitted" },
  { id: 12, value: "Point system for attendance" },
  { id: 13, value: "Clock-in grace period" },
  { id: 14, value: "Clock-out grace period" },
  { id: 15, value: "Allow administrators to log in as user" },
  { id: 16, value: "Enable Text messaging" },
  { id: 17, value: "9 blocker rating system for employee review" },
  { id: 18, value: "9 blocker system horizontal scale" },
  { id: 19, value: "9 blocker system vertical scale" },
  { id: 20, value: "9 blocker rating visible to employee" },
];

export const SubmitFeedBackEnum = [
  { id: 1, value: "A New idea" },
  { id: 2, value: "Enhance functionality" },
  { id: 3, value: "Not working" },
];