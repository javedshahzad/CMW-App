import { TimeOffBankCalendarPage } from '../pages/time-off-bank-calendar/time-off-bank-calendar.page';

export class API {
  public static DEPARTMENT_ROUTES = {
    department: '/Department',
    saveDepartment: '/Department',
    deleteDepartment: '/Department/',
    getDepartmentByCompany: '/Department/GetByCompanyId',
    dataFilter: '/Department/DataFilter',
    getDepartmentById: '/Department',
  };

  public static NOTIFICATION= {
    get: '/Notification',
    getNotificationCount: '/Notification/GetNotificationCount'
  }

  public static SUB_DEPARTMENT_ROUTES = {
    subDepartment: '/Department/GetSubDepartment',
    deleteSubDepartment: '/Department/DeleteSubDepartment',
    getSubDepartmentByCompany: '/Department/GetSubDepartmentByCompanyId',
    getSubDepartmentById: '/Department/GetSubDepartmentById',
    addSubDepartment: '/Department/AddSubDepartment',
    updateSubDepartment: '/Department/EditSubDepartment',
    subDepartmentDataFilter: '/Department/DataFilterSubDepartment',
    getSubDepartmentByDepartmentId:
      '/Department/GetSubDepartmentByDepartmentId',
  };

  public static LOCATION_ROUTES = {
    location: '/Location',
    saveLocation: '/Location',
    deleteLocation: '/Location/',
    getLocationByCompany: '/Location/GetByCompanyId',
    dataFilter: '/Location/DataFilter',
  };

  public static SHIFT_ROUTES = {
    shift: '/Shift',
    getShiftByCompany: '/Shift/GetByCompanyId',
    saveShift: '/Shift',
    deleteShift: '/Shift/',
    getShiftByDate: '/Shift/GetShiftByDate',
    getSkipShiftByDate: '/Shift/GetShiftBySkipDate',
    dataFilter: '/Shift/ShiftByCompanyDataFilter',
    getShiftByDepartment: '/Shift/GetShiftByDepartment',
    getTimeByShiftDateTime: '/Shift/GetShiftDetails',
    getShiftDetailsVot: '/Shift/GetShiftDetailsVot',
    getStartEndTimeByShift: '/Shift/GetStartEndTimeByShift',
    getShiftByUser: '/Shift/Get',
  };

  public static COMPANY_ROUTES = {
    company: '/Company',
    //saveCompany: '/Company',
    deleteCompany: '/Company/',
    dataFilter: '/Company/DataFilter',
    getCompany: "/Company/GetCompanyByUsername",
  };

  public static LOGIN_ROUTES = {
    login: '/token',
    userData: '/User/GetUserClaim',
    loginAsUser: "/User/LogInAsUser",
  };

  public static TERMS_CONDITION_ROUTES = {
    termsCondition: '/TermsAndConditions',
    // termsCondition: '/TermsAndConditions?page=&pageSize=',
    saveTermsCondition: '/TermsAndConditions',
    deleteTermsCondition: '/TermsAndConditions/',
    getTermsConditionByCompany: '/TermsAndConditions/GetByCompanyId',
    dataFilter: '/TermsAndConditions/GetByCompanyDataFilter',
    updateTerms: '/User/UpdateTerms',
    getTerms: '/Pricing/GetTerms',
    downloadPrivacyPolicy: 'Pricing/downloadPrivacyPolicy',
  };

  public static USER_ROUTE = {
    getUser: '/User',
    getUserByCompany: '/User/GetByCompanyId',
    addUser: '/User/AddUser',
    updateUser: '/User',
    deleteUser: '/User/',
    uploadFile: '/User/ImportEmployeeRoster',
    dataFilter: '/User/DataFilter',
    allDataFilter: '/User/GetAllDataFilter',
    getAllManagerList: '/User/GetAllManagerList',
    logout: '/Offer/LogOut',
  };

  public static FORGOT_PASSWORD_ROUTES = {
    forgotPassword: '/User/ForgotPassword',
  };

  public static RESET_PASSWORD_ROUTES = {
    // resetPassword: 'auth/reset-password',
    resetPassword: '/User/ChangePassword',
    recoveryPassword: '/User/ChangePasswordByEmail',
  };

  public static SIGN_UP_ROUTES = {
    signUp: '/User/Register',
    isUserAuthenticate: '/User/CheckIfValidUser',
    getConfiguration: '/Company/GetConfiguration',
    addDeviceInfo:'/Notification/AddFireBaseUserDeviceInfo'
  };

  public static OFFER_ROUTES = {
    getMyOffers: '/Offer/UserRequests',
    deleteOffer: '/Offer/',
    addOffer: '/Offer/Post',
    updateOffer: '/Offer',
    availableOffer: '/Offer/AvailableOffer',
    acceptOffer: '/Offer/AcceptOffer',
    getRequestedOffer: '/Offer/GetApprovalRequests',
    approveOffer: '/Offer/ApproveOffer',
    rejectOffer: '/Offer/RejectOffer',
    getClosedRequest: '/Offer/GetClosedRequests',
    pendingRequest: '/Offer/UserHasPendingOffer',
    deleteOfferUser: '/Offer/DeleteAllForUser',
    availableOfferDataFilter: '/Offer/AvailableDataFilter',
    myRequestOfferDataFilter: '/Offer/MyRequestDataFilter',
    approvalOfferDataFilter: '/Offer/ApprovalRequestDataFilter',
    closedRequestOfferDataFilter: '/Offer/ClosedRequestsDataFilter',
    downloadPendingExcelFile: '/Offer/ExportPendingSwapExcel',
    downloadClosedExcelFile: '/Offer/ExportClosedSwapExcel',
    getShiftWorkingDetails: '/Offer/GetShiftWorkingDetails',
    getAllModuleCloseList:'/Offer/GetAllModuleCloseList',
    getAllModulePendingList:'/Offer/GetAllModulePendingList',
    hrAdminCalendarView:'/Offer/HRAdminCalendarView',
    pendingApprovalRequestDataFilter: '/Offer/PendingListFilterData',
    closeListFilterData: '/Offer/CloseListFilterData',
  };

  public static PLAN_ROUTES = {
    getPlan: '/Pricing/',
    updatePlan: '/Pricing',
    getState: '/State',
  };

  public static CALL_OFF_REQUEST = {
    callOffReasons: '/Reason',
    callOffReasonsGetAll: '/Reason/GetAll',
    addCallOff: '/Offer/RequestCallOff',
    editCallOff: '/Offer/EditCallOffRequest',
    checkMonthlyCallOffRequest: '/Offer/GetNumberOfRequest',
    getUserList: '/Offer/UserCallOffRequests',
    userDataFilter: '/Offer/UserCallOffRequestsDataFilter',
    getClosedVotRequestOffer: '/Offer/GetCloseduserRequests',
    getCallOffReqestedList: '/Offer/GetApprovalCalloffRequests',
    approveCallOffOffer: '/Offer/ApproveCallOffOffers',
    approvalDataFilter: '/Offer/ApprovalCalloffDataFilter',
    closedDataFilter: '/Offer/ClosedCalloffDataFilter',
    callOffReasonFilterdata: '/Reason/CallOffReasonFilterdata',
    addCallOffReason: '/Reason/AddCallOffReason',
    downloadPendingExcelFile: '/Offer/ExportcallOffExcel',
    downloadClosedExcelFile: '/Offer/ExportClosedCallOffExcel',
    getCallOffListForManager: '/Offer/GetCallOffListForManager',
    managerCallOffOfferDataFilter: '/Offer/ManagerCallOffDataFilter',
    getSettingByCompanyID: '/Offer/GetSettingByCompanyID',
    settingType: '/Setting/GetSetting',
  };
  public static CLOCK_IN_OUT_REQUEST = {
    getClockInOut: '/TimePunches/GetListByUser',
    getClockInOutPunch: '/TimePunches/Punches',
    IsDeviceIdentifierExists: '/TimePunches/IsDeviceIdentifierExists',
    GetUserConfiguration:'/User/GetUserConfiguration',
    settingType: '/Setting/GetSetting',
    timePunchesDataFilter:'/TimePunches/DataFilter',
    calculateDistants:'/TimePunches/CalculateDistants_new',
    getUserWeekHour:"/TimePunches/GetUserWeekHour",
    removeTimePunchRequest: "/TimePunches/RemoveTimePunchRequest",
    getPeriodPayloadAPP:"/TimePunches/GetPeriodPayloadAPP",
    resetIdentity : "/TimePunches/ResetIdentity"
  };
  public static EARLY_OUT_REQUEST = {
    addEarlyOutRequest: '/Offer/AddEarlyOutRequest',
    getUserEarlyOutRequestList: '/Offer/EarlyOutUserRequests',
    updateEarlyOutRequest: '/Offer/UpdateEarlyOutRequest',
    userDataFilter: '/Offer/EarlyOutUserRequestsDataFilter',
    avilableManagerEarlyOutOffers: '/Offer/AvailableManagerEarlyOutOffers',
    rejectManagerEarlyOutOffers: '/Offer/RejectEarlyOutOffers',
    approveManagerEarlyOutOffers: '/Offer/ApproveManagerEarlyOutOffers',
    availableManagerEarlyOutDataFilter:
      '/Offer/AvailableManagerEarlyOutDataFilter',
    closedManagerEarlyOutOffers: '/Offer/GetClosedManagerEarlyGoRequests',
    managerClosedEarlyOutDataFilter:
      '/Offer/GetClosedManagerEarlyGoRequestsFilter',
    hrPendingRequests: '/Offer/UnprocessedEarlyOutRequest',
    hrClosedRequests: '/Offer/ClosedEarlyOutRequest',
    hrPendingEarltyOutOfferDataFilter:
      '/Offer/UnprocessedEarlyOutRequestDataFilter',
    hrClosedEarltyOutOfferDataFilter: '/Offer/ClosedEarlyOutRequestDataFilter',
    proceedHroffer: '/Offer/ProcessSingleOffer',
    rejectHrEarlyOutOffers: '/Offer/RejectEarlyOutOffers',
    downloadPendingExcelFile: '/Offer/ExportEarlyOutExcel',
    downloadClosedExcelFile: '/Offer/ExportClosedEarlyOutExcel',
    settingType: '/Setting/GetSetting',
  };
  public static EMPLOYEE_ROSTER = {
    EmployeeRoster: '/EmployeeRoster',
    dataFilter: '/EmployeeRoster/DataFilter',
  };
  public static OFFER_LOG = {
    OfferLogEntry: '/Offer/OfferLogEntry',
  };
  public static INVOICE_ROUTES = {
    getInvoice: '/Invoice/GetListByCompanyId',
    updateInvoice: '/Invoice',
    dataFilter: '/Invoice/InvoiceByCompanyDataFilter',
    printInvoice: '/Invoice/GeneratePDF',
  };
  public static MARKET_CAMPAIGN = {
    add: '/MarketCampaign/Add',
  };

  public static VOT_REQUEST_ROUTES = {
    getVotRequest: '/Offer/UserVotRequests',
    addVotRequest: '/Offer/AddVotRequest',
    updateVotRequest: '/Offer/UpdateVotRequest',
    votRequestOfferDataFilter: '/Offer/UserVotDataFilter',
    getHrVotRequest: '/Offer/GetApprovalVotRequests',
    getVotHours: '/Offer/GetApproveVothours',
    approveVotOffer: '/Offer/ApproveVotOffers',
    rejectVotOffer: '/Offer/RejectVotOffers',
    getClosedVotRequestOffer: '/Offer/GetClosedVotRequests',
    approveVotDataFilter: '/Offer/ApprovalVotDataFIlter',
    closedVotDataFilter: '/Offer/ClosedVotFilterData',
    downloadExcel: '/Offer/ExportExcel',
    downloadClosedExcelFile: '/Offer/ExportClosedVotExcel',
  };

  public static VTO_REQUEST_ROUTES = {
    addVtoRequest: '/Offer/AddVtoRequest',
    getVtoRequest: '/Offer/UserVtoRequests',
    vtoRequestOfferDataFilter: '/Offer/UserVtoRequestsDataFilter',
    updateVtoRequest: '/Offer/UpdateVtoRequest',
    availableVtoRequest: '/Offer/AvailableVtoOffer',
    availableVtoOfferDataFilter: '/Offer/AvailableVtoDataFilter',
    acceptVtoOffer: '/Offer/AcceptVtoOffer',
    approveVtoOffer: '/Offer/ApproveVtoOffer',
    rejectVtoOffer: '/Offer/RejectVtoOffer',
    getPendingApprovalRequest: '/Offer/GetApprovalVtoRequests',
    pendingApprovalRequestDataFilter: '/Offer/ApprovalVtoDataFilter',
    getVtoClosedRequest: '/Offer/GetClosedVtoRequests',
    vtoClosedRequestDataFilter: '/Offer/ClosedVtoDataFilter',
    getUnProcessedVtoRequest: '/Offer/UnprocessedVtoRequest',
    availableManagerVtoOffers: '/Offer/AvailableManagerVtoOffers',
    vtoManagerAvailableRequestDataFilter:
      '/Offer/AvailableManagerVtoDataFilter',
    approveRejectMangerVtoOffer: '/Offer/ApproveRejectVto',
    processVtoRequest: '/Offer/ProcessOffer',
    unProcessedVtoOfferDataFilter: '/Offer/UnprocessedVtoDataFilter',
    instantVtoRequest: '/Offer/InstantVtoRequest',
    downloadPendingVtoFile: '/Offer/ExportVtoExcel',
    downloadClosedVtoFile: '/Offer/ExportClosedVtoExcel',
  };

  public static FLEX_REQUEST_ROUTES = {
    addFlexRequest: '/Offer/AddFlexWorkRequest',
    getFlexRequest: '/Offer/UserFlexWorkRequests',
    flexRequestOfferDataFilter: '/Offer/UserFlexWorkRequestsDataFilter',
    updateFlexRequest: '/Offer/UpdateFlexWorkRequest',
    availableFlexRequest: '/Offer/AvailableFlexWorkOffer',
    availableFlexOfferDataFilter: '/Offer/AvailableFlexWorkDataFilter',
    acceptFlexOffer: '/Offer/AcceptFlexWorkOffer',
    approveFlexOffer: '/Offer/ApproveVtoOffer',
    rejectFlexOffer: '/Offer/RejectVtoOffer',
    // getPendingApprovalRequest: '/Offer/GetApprovalVtoRequests',
    // pendingApprovalRequestDataFilter: '/Offer/ApprovalVtoDataFilter',
    getFlexClosedRequest: '/Offer/GetClosedFlexWorkRequests',
    flexClosedRequestDataFilter: '/Offer/GetClosedFlexWorkDataFilter',
    // getUnProcessedVtoRequest: '/Offer/UnprocessedVtoRequest',
    availableHrAdminFlexOffers: '/Offer/AvailableHRFlexWorkOffers',
    flexHrAdminAvailableRequestDataFilter:
      '/Offer/AvailableHRFlexWorkDataFilter',
    approveRejectHrAdminFlexOffer: '/Offer/ApproveRejectFlexWork',
    processFlexRequest: '/Offer/ProcessFlexWorkOffer',
    // unProcessedVtoOfferDataFilter: '/Offer/UnprocessedVtoDataFilter',
    instantFlexRequest: '/Offer/InstantFlexWorkRequest',
    // downloadPendingVtoFile: '/Offer/ExportVtoExcel',
    downloadClosedFlexFile: '/Offer/ExportClosedFlexWorkExcel',
  };

  public static SETTING_ROUTES = {
    addSetting: '/Setting/AddSetting',
    updateSetting: '/Setting/AddSetting',
    getSetting: '/Setting/GetSetting',
  };
  public static TRANSFER_REQUEST_ROUTES = {
    addTransferRequest: '/Offer/AddTransferRequest',
    updateTransferRequest: '/Offer/UpdateTransferRequest',
    getUserTransferRequestList: '/Offer/GetTransferRequestsForUser',
    closedManagerTransferOffers: '/Offer/GetClosedManagerTransferRequests',
    downloadPendingExcelFile: '/Offer/ExportTransferExcel',
    downloadClosedExcelFile: '/Offer/ExportClosedTransferExcel',
    hrTransferPendingRequests: '/Offer/GetTransferRequestsForHrandManager',
    hrTransferClosedRequests: '/Offer/GetClosedTransferRequests',
    hrPendingTransferOfferDataFilter: '/Offer/GetTransferRequestsDataFilter',
    hrClosedTransferOfferDataFilter: '/Offer/GetClosedTransferWorkDataFilter',
    approveTransferRequest: '/Offer/ApproveTransferRequestByHr',
    approveDenialRequest: '/Offer/DenyTransferRequestByHr',
    acceptTransferRequest: '/Offer/AcceptTransferRequestByUser',
    rejectTransferRequestByUser: '/Offer/RejectTransferRequestByUser',
    transferProcessRequest: '/Offer/ProcessTransferOffer',
    transferRequestForUserDataFilter:
      '/Offer/GetTransferRequestsForUserDataFilter',
  };
  public static TIME_OFF_CONFIG = {
    timeOffGetAll: '/TimeOffConfiguration/GetAll',
    timeOffGetAllForUser: '/TimeOffConfiguration/GetAllConfigForUser',
    timeOffConfigTypesList: '/TimeOffConfigTypes/GetAll',
    addTimeOff: '/TimeOffConfiguration/AddTimeOffConfiguration',
    editTimeOff: '/TimeOffConfiguration/EditTimeOffConfiguration',
    deleteTimeOff: '/TimeOffConfiguration/DeleteTimeOffConfiguration',
    timeOffFilter: '/TimeOffConfiguration/TimeOffConfigurationFilterdata',
    timeOffBank: '/TimeOffConfiguration/GetAllConfigForUser',
    timeOffBankCalendar: '/TimeOffUserRequest/GetTimeOutCalender',
  };
  public static TIME_OFF_HR_REQUESTS = {
    addHrTimeOffRequest: '/TimeOffUserRequest/AddHrTimeOffUserRequest',
    updateHrTimeOffRequest: '/TimeOffUserRequest/EditTimeOffUserRequest',
    gethrUserRequests: '/TimeOffUserRequest/GetTimeOffUserRequestList',
    getPendingTimeOffRequestList:
      '/TimeOffUserRequest/GetAllPendingTimeOffRequests',
    getPendingTimeOffRequestListFilterData:
      '/TimeOffUserRequest/GetAllPendingTimeOffRequestsDataFilter',
    getClosedTimeOffRequestList:
      '/TimeOffUserRequest/GetAllClosedTimeOffRequests',
    getClosedTimeOffRequestListFilterData:
      '/TimeOffUserRequest/GetAllClosedTimeOffRequestsDataFilter',
    hrUserRequestsFilter: '/TimeOffUserRequest/TimeOffHRUserRequestFilterdata',
    deleteUserTimeOffRequest: '/TimeOffUserRequest/DeleteTimeOffUserRequest',
    approveDeniedUserRequest:
      '/TimeOffUserRequest/ApproveRejectTimeOffRequests',
    downloadClosedRequests:
      '/TimeOffUserRequest/ExportAllClosedTimeOffUserRequest',
    downloadPendingRequests:
      '/TimeOffUserRequest/ExportAllPendingTimeOffUserRequest',
    downloadSummaryRequests:
      '/TimeOffUserRequest/ExportTimeOffConfigurationSummary',
    downloadDetailsRequests:
      '/TimeOffUserRequest/ExportTimeOffConfigurationDetail',
  };
  public static TIME_OFF_USER = {
    timeOffGetAllUser: '/TimeOffUserRequest/GetTimeOffUserNameRequestList',
    addTimeOffRequest: '/TimeOffUserRequest/AddTimeOffUserRequest',
    editTimeOffRequest: '/TimeOffUserRequest/EditTimeOffUserRequest',
    deleteTimeOffRequest: '/TimeOffUserRequest/DeleteTimeOffUserRequest',
    userDataFilter: '/TimeOffUserRequest/TimeOffUserRequestFilterdata',
  };

  public static LATE_IN_REQUEST = {
    addLateInRequest: '/Offer/AddLateInRequest',
    getUserLateInRequestList: '/Offer/LateInUserRequests',
    updateLateInRequest: '/Offer/UpdateLateInRequest',
    settingType: '/Setting/GetSetting',
    userDataFilter: '/Offer/LateInUserRequestsDataFilter',
    closedManagerLateInOffers: '/Offer/GetClosedManagerLateInRequests',
    proceedHroffer: "/Offer/ProcessSingleOffer",
  };

  public static TIME_PUNCH = {
    userAddRequest: '/TimePunchesEdits/AddTimePunchRequest',
    getUserRequest: '/TimePunchesEdits/GetRequestsForUsers', //edited time punch
    getUserRequestDataFilter : '/TimePunchesEdits/GetRequestsForUsersDataFilter',
    approveRejectTimePuncheEditRequest:'/TimePunchesEdits/ApproveRejectTimePuncheEditRequest',
    editUserRequest: "/TimePunchesEdits/EditTimePunchRequest"
  }

  public static FEEDBACK_ROUTES = {
    addFeedbackRequest: "/IssueReport/SendReport"
  }
}
