import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VotApproveRejectConfirmationComponent } from './vot-approve-reject-confirmation.component';

describe('VotApproveRejectConfirmationComponent', () => {
  let component: VotApproveRejectConfirmationComponent;
  let fixture: ComponentFixture<VotApproveRejectConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VotApproveRejectConfirmationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VotApproveRejectConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
