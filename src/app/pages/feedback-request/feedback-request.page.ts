import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Constants, SubmitFeedBackEnum } from 'src/app/constant/constants';
import { FormService } from 'src/app/services/form/form.service';
import { UserService } from 'src/app/services/user/user.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { FileToUpload } from 'src/app/models/fileUpload.model';
import { Offer, IssueReportModel } from 'src/app/models/offer.model';
import {
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";

@Component({
  selector: 'app-feedback-request',
  templateUrl: './feedback-request.page.html',
  styleUrls: ['./feedback-request.page.scss'],
})
export class FeedbackRequestPage implements OnInit {
  @ViewChild('myFileInput') myFileInput;
  offer: Offer;
  feedbackType = SubmitFeedBackEnum;
  theFiles: any[] = [];
  fileForTotalSize: any;
  fileSizeArr: any = [];
  totalSize: any = 0;
  fileObj: any = [];
  public messageList: any = new IssueReportModel();
  public feedbackForm: FormGroup;
  constructor(public router: Router,
    private formService: FormService,
    private userService: UserService,
    private utilityService: UtilityService) { }

  ngOnInit() { 
    this.feedbackForm = new FormGroup({
      UserID: new FormControl(localStorage.getItem("userId")),
      Subject: new FormControl("", Validators.required),
      Body: new FormControl("", Validators.required),
      Attachment: new FormControl()
    });
  }

  ionViewWillEnter() {
    this.theFiles = [];
    this.fileForTotalSize = 0;
    this.fileSizeArr = [];
    this.totalSize = 0;
    this.fileObj = [];

    this.utilityService.isLoading = false;
    this.initializeMessages();
  }

  onSave() {
    this.formService.markFormGroupTouched(this.feedbackForm);
    if (this.feedbackForm.invalid) {
      return;
    }
    if (this.totalSize >= 5) {
      this.utilityService.showErrorToast("Selected files have exceeded the limit");
      return;
    }
    this.utilityService.showLoadingwithoutDuration();
    this.feedbackForm.controls.Attachment.setValue(this.fileObj);
    this.userService.addFeedbackRequest(this.feedbackForm.value).then((res) => {
      this.utilityService.hideLoading();
      if (res["Success"]) {
        this.utilityService.showSuccessToast("Your request has been submitted. Someone will contact you soon");
        this.goBack();
      }
    }, (e) => {
      this.utilityService.hideLoading();
      this.utilityService.showErrorToast("Something went wrong!");
    });
  }

  initializeMessages() {
    this.messageList.Body = {
      required: Constants.VALIDATION_MSG.FEEDBACK.DESCRIPTION_REQUIRED,
    };
    this.messageList.Subject = {
      required: Constants.VALIDATION_MSG.FEEDBACK.FEEDBACK_OPTION,
    };
  }

  goBack() {
    var selected_tab = localStorage.getItem('selected_tab');
    if (selected_tab == 'pending_request') {
      this.router.navigate(['tabs/pending-requests']);
    }
    else if (selected_tab == 'close_request') {
      this.router.navigate(['tabs/closed-requests']);
    }
    else if (selected_tab == 'my_request') {
      this.router.navigate(['/tabs/my-requests']);
    } else {
      this.router.navigate(['/tabs/available-requests']);
    }
  }


  onFileChange(event) {
    this.theFiles = [];
    let file = event.target.files[0];
    if (this.fileObj.some(e => e.FileName === file.name)) {
      this.utilityService.showErrorToast("This file has already been added");
      return;
    }
    let fileSizeMB = (file.size / 1024) / 1024;
    this.fileForTotalSize = fileSizeMB;
    let fileName = file.name.toLowerCase().split(".")
    if (fileName[fileName.length - 1] == "exe" || fileName[fileName.length - 1] == "sln" || fileName[fileName.length - 1] == "html" ||
      fileName[fileName.length - 1] == "apk" || fileName[fileName.length - 1] == "zip" || fileName[fileName.length - 1] == "css" || fileName[fileName.length - 1] == "json") {
      this.utilityService.showErrorToast("This file format isn't supported");
      return;
    }
    else if (fileSizeMB < 0.001) {
      this.utilityService.showErrorToast("Selected file size must be larger than 1 KB");
      this.myFileInput.nativeElement.value = '';
      return;
    }
    else if ((this.totalSize + fileSizeMB) >= 5) {
      this.utilityService.showErrorToast("Selected files have exceeded the limit");
      this.myFileInput.nativeElement.value = '';
      return;
    }
    else {
      this.totalSize += this.fileForTotalSize;
      this.theFiles.push(file);
      this.fileSizeArr.push(this.fileForTotalSize);
      this.readAndUploadFile(this.theFiles[0]);
      this.myFileInput.nativeElement.value = '';
    }
  }

  private readAndUploadFile(theFile: any) {
    let file = new FileToUpload();

    // Set File Information
    file.fileName = theFile.name;
    file.fileSize = theFile.size;
    file.fileType = theFile.type;
    file.lastModifiedTime = theFile.lastModified;
    file.lastModifiedDate = theFile.lastModifiedDate;

    // Use FileReader() object to get file to upload
    let reader = new FileReader();

    // Setup onload event for reader
    reader.onload = () => {
      // Store base64 encoded version of file
      file.fileAsBase64 = reader.result.toString();
      this.fileObj.push({
        FileName: file.fileName,
        Base64StringFile: file.fileAsBase64
      })
    }

    // Read the file
    reader.readAsDataURL(theFile);
  }

  removeFile(index: number) {
    this.fileObj.splice(index, 1);
    this.totalSize -= this.fileSizeArr[index];
    this.fileSizeArr.splice(index, 1);
    this.myFileInput.nativeElement.value = '';
  }

  ionViewDidLeave() {
    this.totalSize = 0;
    this.fileObj = [];
    this.myFileInput.nativeElement.value = '';
    this.feedbackForm.controls.Subject.reset();
    this.feedbackForm.controls.Body.reset();
  }
}
