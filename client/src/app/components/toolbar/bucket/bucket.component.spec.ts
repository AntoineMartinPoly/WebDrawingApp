import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSliderChange, MatSliderModule } from '@angular/material';
import { SEVEN } from 'src/constant/constant';
import { BUCKET_TOLERANCE } from 'src/constant/storage/constant';
import { BucketComponent } from './bucket.component';

describe('BucketComponent', () => {
  let component: BucketComponent;
  let fixture: ComponentFixture<BucketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BucketComponent ],
      imports: [ MatSliderModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BucketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should call changeShortcutAccess', () => {
    const shortcutSpy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(true);
    expect(shortcutSpy).toHaveBeenCalledWith(true);
  });

  it('updateTolerance should call storage.set if event is defined', () => {
    const updateSpy = spyOn(component.storage, 'set');
    component.updateTolerance({value: SEVEN} as MatSliderChange);
    expect(updateSpy).toHaveBeenCalledWith(BUCKET_TOLERANCE, SEVEN.toString());
  });

  it('updateTolerance should call nothingif event is undefined', () => {
    const updateSpy = spyOn(component.storage, 'set');
    component.updateTolerance({} as MatSliderChange);
    expect(updateSpy).not.toHaveBeenCalled();
  });
});
