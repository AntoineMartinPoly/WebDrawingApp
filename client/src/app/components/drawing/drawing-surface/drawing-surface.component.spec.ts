import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { ActionService } from 'src/app/services/actions/action.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { MockToolHandler } from 'src/app/services/tool-handler/tool-handler.service.spec';
import { COMPONENT_TEST_DEFAULT_TIMEOUT, NO_VALUE } from '../../../../constant/constant';
import { CURSOR } from '../../../../constant/drawing/constant';
import { FAKE_KEY_MODIFIER, LEFT_KEY, RIGHT_KEY } from '../../../../constant/toolbar/constant';
import { DrawingSurfaceComponent } from './drawing-surface.component';

describe('DrawingSurfaceComponent', () => {
  let component: DrawingSurfaceComponent;
  let fixture: ComponentFixture<DrawingSurfaceComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawingSurfaceComponent);
    component = fixture.componentInstance;
    component.actionService = new ActionService();
    ToolHandler.currentToolType = new MockToolHandler();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngAfterViewInit should call generateBackground and addAllListeners', () => {
    const drawGenSpy = spyOn(component.draw, 'generateBackground');
    const resizeSpy = spyOn(component, 'resizeDrawSurface');
    const generateSpy = spyOn(component.gridGenerator, 'generateGrid');
    const listenerSpy = spyOn(component, 'addAllListeners');
    const deleteSpy = spyOn(component.storage, 'delete');
    const clearSpy = spyOn(component.actionService, 'clearActions');
    component.toolbarService.sendCursorUpdate(CURSOR);
    component.ngAfterViewInit();
    expect(drawGenSpy).toHaveBeenCalled();
    expect(resizeSpy).toHaveBeenCalled();
    expect(generateSpy).toHaveBeenCalled();
    expect(listenerSpy).toHaveBeenCalled();
    expect(deleteSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveBeenCalled();
  });

  it('addAllListeners should call all functions that generate an event listener', () => {
    const componentSpyDown: jasmine.Spy = spyOn(component, 'mouseDownListener');
    const componentSpyMove: jasmine.Spy = spyOn(component, 'mouseMoveListener');
    const componentSpyUp: jasmine.Spy = spyOn(component, 'mouseUpListener');
    const componentSpyLeave: jasmine.Spy = spyOn(component, 'mouseLeaveListener');
    const componentSpyDblClk: jasmine.Spy = spyOn(component, 'mouseDoubleClickListener');
    const componentSpyWheel: jasmine.Spy = spyOn(component, 'mouseWheelListener');
    const componentSpyKeyPress: jasmine.Spy = spyOn(component, 'keypressListener');
    component.addAllListeners();
    expect(componentSpyDown).toHaveBeenCalled();
    expect(componentSpyMove).toHaveBeenCalled();
    expect(componentSpyUp).toHaveBeenCalled();
    expect(componentSpyLeave).toHaveBeenCalled();
    expect(componentSpyDblClk).toHaveBeenCalled();
    expect(componentSpyWheel).toHaveBeenCalled();
    expect(componentSpyKeyPress).toHaveBeenCalled();
  });

  it('mouseDownListener should call handleMouseDown and generateKeyModifierObject', (done) => {
    const event = new MouseEvent('mousedown');
    const genKeyModSpy = spyOn(component, 'generateKeyModifierObject');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleMouseDown');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(genKeyModSpy).toHaveBeenCalled();
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('mouseMoveListener should call handleMouseMove and generateKeyModifierObject', (done) => {
    const event = new MouseEvent('mousemove');
    const genKeyModSpy = spyOn(component, 'generateKeyModifierObject');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleMouseMove');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(genKeyModSpy).toHaveBeenCalled();
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('mouseUpListener should call handleMouseUp and generateKeyModifierObject', (done) => {
    const event = new MouseEvent('mouseup');
    const genKeyModSpy = spyOn(component, 'generateKeyModifierObject');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleMouseUp');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(genKeyModSpy).toHaveBeenCalled();
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('mouseLeaveListener should call handleMouseLeave ', (done) => {
    const event = new MouseEvent('mouseleave');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleMouseLeave');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('mouseDoubleClickListener should call handleDoubleClick and generateKeyModifierObject', (done) => {
    const event = new MouseEvent('dblclick');
    const genKeyModSpy = spyOn(component, 'generateKeyModifierObject');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleDoubleClick');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(genKeyModSpy).toHaveBeenCalled();
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('mouseWheelListener should call handleMouseWheel and generateKeyModifierObject', (done) => {
    const event = new MouseEvent('wheel');
    const genKeyModSpy = spyOn(component, 'generateKeyModifierObject').and.returnValue(FAKE_KEY_MODIFIER);
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleMouseWheel');
    component.svg.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(genKeyModSpy).toHaveBeenCalled();
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('keypressListener should call handleKeypress and generateKeyModifierObject', (done) => {
    const event = new KeyboardEvent('keydown');
    const handlerSpy = spyOn(ToolHandler.currentToolType, 'handleKeypress');
    component.keypressListener();
    document.dispatchEvent(event);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(handlerSpy).toHaveBeenCalled();
      done();
    });
  });

  it('updateGrid should be called on init', (done) => {
    const generateGridSpy: jasmine.Spy = spyOn(component.gridGenerator, 'generateGrid');
    component.ngAfterViewInit();
    fixture.whenStable().then(() => {
      expect(generateGridSpy).toHaveBeenCalled();
      done();
    });
  });

  // it('resizeDrawSurface should set isEmpty to true and call setSVG, ' +
  //   'clearAction, removeAllObjectsFromSurface, setAttributes and appendChild', () => {
  //   const clearActionSpy = spyOn(component.actionService, 'clearActions');
  //   const removeSpy = spyOn(component, 'removeAllObjectsFromSurface');
  //   const setSpy = spyOn(component.renderer, 'setAttribute');
  //   const appendSpy = spyOn(component.renderer, 'appendChild');
  //   component.dataService.sendData('10', '10', WHITE);
  //   component.resizeDrawSurface();
  //   expect(component.isEmpty).toEqual(true);
  //   expect(component.dimensions).toEqual({height: '10', width: '10', color: WHITE});
  //   expect(clearActionSpy).toHaveBeenCalled();
  //   expect(removeSpy).toHaveBeenCalled();
  //   expect(setSpy).toHaveBeenCalled();
  //   expect(appendSpy).toHaveBeenCalled();
  //   expect(component.svg).toEqual(component.draw.setSVG('10', '10', WHITE));
  // });

  it('removeAllObjectFromSurface set innerHtML to No_VALUE', () => {
    component.removeAllObjectsFromSurface();
    expect(component.svg.innerHTML).toEqual(NO_VALUE);
  });

  it('newDrawingListener get reset drawing notification and call clearActions', () => {
    const clearService = spyOn(component.actionService, 'clearActions');
    component.imageHandler.sendResetDrawingNotification();
    component.newDrawingListener();
    expect(clearService).toHaveBeenCalled();
  });

  it('generateKeyModifierObject generate a keyModifier', () => {
    const event = new MouseEvent('mousemove');
    const keyModifier = component.generateKeyModifierObject(event);
    expect(keyModifier).toEqual({shift: event.shiftKey,
      leftKey: (event.button ===  LEFT_KEY),
      rightKey: (event.button ===  RIGHT_KEY),
      altKey: event.altKey});
  });

  it('@HostListener call preventDefault', () => {
    const event = new MouseEvent('contextmenu');
    const eventSpy = spyOn(event, 'preventDefault');
    component.disableRightClick(event);
    expect(eventSpy).toHaveBeenCalled();
  });
});
