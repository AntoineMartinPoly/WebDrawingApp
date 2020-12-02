import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { StorageService } from 'src/app/services/storage/storage.service';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../constant/constant';
import { TraceComponent } from './trace.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('TraceComponent', () => {
  let component: TraceComponent;
  let fixture: ComponentFixture<TraceComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const storage: StorageService = TestBed.get(StorageService);
    spyOn(storage, 'get').and.returnValue('trace_pencil');
    spyOn(storage, 'set');
    fixture = TestBed.createComponent(TraceComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should changeShortcutAccess of shortcut service', () => {
    const changeSpy: jasmine.Spy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(false);
    expect(changeSpy).toHaveBeenCalled();
  });
});
