import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcceptEarlyGoRequestComponent } from './accept-early-go-request.component';

describe('AcceptEarlyGoRequestComponent', () => {
  let component: AcceptEarlyGoRequestComponent;
  let fixture: ComponentFixture<AcceptEarlyGoRequestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptEarlyGoRequestComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptEarlyGoRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
