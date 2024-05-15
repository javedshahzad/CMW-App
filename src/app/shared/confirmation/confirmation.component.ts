import { Component, OnInit, ViewChild, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Constants } from 'src/app/constant/constants';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit, AfterViewInit {
  @Input() Id?= '';
  @Input() kioskId?= '';
  @Input() text?= Constants.DELETE_MSG;
  @Output() close = new EventEmitter<boolean>();
  @Output() confirmId = new EventEmitter<any>();
  @Input() btnSaveText?= Constants.YES;
  @Input() btnCancleText?= Constants.NO;
  @ViewChild('confTemplate', { static: false }) confTemplate;
  confModalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }
  

  ngAfterViewInit() {
    this.confModalRef = this.modalService.show(this.confTemplate, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static'
    });
  }

  closeModal(val: boolean) {
    this.confModalRef.hide();
    this.close.emit(val);
  }

  onClick() {
    this.confirmId.emit(this.Id);
    this.confModalRef.hide();
    //this.close.emit(true);
  }
}
