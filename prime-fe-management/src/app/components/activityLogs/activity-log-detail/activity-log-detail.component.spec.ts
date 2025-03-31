import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityLogDetailComponent } from './activity-log-detail.component';

describe('ActivityLogDetailComponent', () => {
  let component: ActivityLogDetailComponent;
  let fixture: ComponentFixture<ActivityLogDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityLogDetailComponent]
    });
    fixture = TestBed.createComponent(ActivityLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
