import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PipetteComponent } from './pipette.component';

describe('PipetteComponent', () => {
  let component: PipetteComponent;
  let fixture: ComponentFixture<PipetteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipetteComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipetteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and call toolbarService initiateHandlerUpdate and sendCursorUpdate', () => {
    const handlerUpdateSpy: jasmine.Spy = spyOn(component.toolbarService, 'initiateHandlerUpdate');
    const sendCursoreSpy: jasmine.Spy = spyOn(component.toolbarService, 'sendCursorUpdate');
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(handlerUpdateSpy).toHaveBeenCalled();
    expect(sendCursoreSpy).toHaveBeenCalled();
  });
});
