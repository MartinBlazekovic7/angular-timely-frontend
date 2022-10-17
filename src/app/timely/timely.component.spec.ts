import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimelyComponent } from './timely.component';

describe('TimelyComponent', () => {
  let component: TimelyComponent;
  let fixture: ComponentFixture<TimelyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimelyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
