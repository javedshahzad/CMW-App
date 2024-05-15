import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VtoApproveRejectConfirmationComponent } from './vto-approve-reject-confirmation.component';

describe('VtoApproveRejectConfirmationComponent', () => {
  let component: VtoApproveRejectConfirmationComponent;
  let fixture: ComponentFixture<VtoApproveRejectConfirmationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VtoApproveRejectConfirmationComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VtoApproveRejectConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
