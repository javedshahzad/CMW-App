import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddEditEarlyGoRequestPage } from './add-edit-early-go-request.page';

describe('AddEditEarlyGoRequestPage', () => {
  let component: AddEditEarlyGoRequestPage;
  let fixture: ComponentFixture<AddEditEarlyGoRequestPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditEarlyGoRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditEarlyGoRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
