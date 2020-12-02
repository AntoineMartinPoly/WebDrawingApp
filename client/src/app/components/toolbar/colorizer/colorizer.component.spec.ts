import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorizerComponent } from './colorizer.component';

describe('ColorizerComponent', () => {
  let component: ColorizerComponent;
  let fixture: ComponentFixture<ColorizerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorizerComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorizerComponent);
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
