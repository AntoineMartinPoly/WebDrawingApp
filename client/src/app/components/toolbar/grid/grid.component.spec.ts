import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {AbstractControl} from '@angular/forms';
import {MatSliderChange} from '@angular/material/slider';
import { AppModule } from 'src/app/app.module';
import {COMPONENT_TEST_DEFAULT_TIMEOUT, ZERO} from 'src/constant/constant';
import {OPTION_GRID_SHOWN, OPTION_GRID_SIZE} from 'src/constant/storage/constant';
import {HIDDEN, SIZE} from 'src/constant/toolbar/grid/constant';
import {ONE} from 'src/constant/toolbar/shape/constant';
import { GridComponent } from './grid.component';

describe('GridSurfaceComponent', () => {
  let component: GridComponent;
  let fixture: ComponentFixture<GridComponent>;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DialogTestModule,
      ],
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('changeShortcutAccess should changeShortcutAccess of shortcut service', () => {
    const changeSpy: jasmine.Spy = spyOn(component.shortcutService, 'changeShortcutAccess');
    component.changeShortcutAccess(false);
    expect(changeSpy).toHaveBeenCalled();
  });

  it('updateSize call storage.set and gridService updateSize', () => {
    const size = (component.form.get(SIZE) as AbstractControl).value;
    const setStorageSpy = spyOn(component.storage, 'set');
    const gridUpdateSpy = spyOn(component.gridService, 'updateSize');
    component.updateSize();
    expect(setStorageSpy).toHaveBeenCalled();
    expect(gridUpdateSpy).toHaveBeenCalled();
    expect(component.size).toEqual(size);
  });

  it('updateOpacity call gridservice.updateOpacity and storage.set', () => {
    const gridUpdateSpy = spyOn(component.gridService, 'updateOpacity');
    const setStorageSpy = spyOn(component.storage, 'set');
    const event = new MatSliderChange();
    event.value = ONE;
    component.updateOpacity(event);
    expect(setStorageSpy).toHaveBeenCalled();
    expect(gridUpdateSpy).toHaveBeenCalled();
  });

  it('updateOpacity should not call ridservice.updateOpacity and storage.set' +
    ' when event.value equal zer', () => {
    const gridUpdateSpy = spyOn(component.gridService, 'updateOpacity');
    const setStorageSpy = spyOn(component.storage, 'set');
    const event = new MatSliderChange();
    event.value = ZERO;
    component.updateOpacity(event);
    expect(setStorageSpy).not.toHaveBeenCalled();
    expect(gridUpdateSpy).not.toHaveBeenCalled();
  });

  it('toggleGrid should set OPTION_GRID_SHOWN to HIDDEN when isShown equal false', () => {
    const toggleSpy = spyOn(component.gridService, 'toggleGrid');
    component.toggleGrid();
    const visibility = component.storage.get(OPTION_GRID_SHOWN);
    expect(visibility).toEqual(HIDDEN);
    expect(toggleSpy).toHaveBeenCalled();
  });

  it('updateSize should set OPTION_GRID_SIZE to zero when size is undefined or equal ZERO ', () => {
    const gridUpdateSpy = spyOn(component.gridService, 'updateSize');
    component.form.controls.size.setValue(ZERO);
    component.updateSize();
    const size = component.storage.get(OPTION_GRID_SIZE);
    expect(size).toEqual('0');
    expect(gridUpdateSpy).toHaveBeenCalled();

  });

  it('updateSize should set OPTION_GRID_SIZE to the size.toString when size is defined  ', () => {
    const gridUpdateSpy = spyOn(component.gridService, 'updateSize');
    component.form.controls.size.setValue(ONE);
    component.updateSize();
    const size = component.storage.get(OPTION_GRID_SIZE);
    expect(size).toEqual('1');
    expect(gridUpdateSpy).toHaveBeenCalled();
  });

});
