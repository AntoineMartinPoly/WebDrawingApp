import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { SaveService } from 'src/app/services/tool-service/save/save.service';
import {GridService} from '../../../services/grid/grid.service';
import { ExportComponent } from './export.component';

describe('ExportComponent', () => {
  let component: ExportComponent;
  let fixture: ComponentFixture<ExportComponent>;

  @NgModule({
    imports: [
      AppModule,
    ],
  })
  class DialogTestModule { }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ DialogTestModule ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    const saveService: SaveService = TestBed.get(SaveService);
    const gridService: GridService = TestBed.get(GridService);
    spyOn(gridService, 'toggleGrid');
    spyOn(saveService, 'createImageSrc');
    fixture = TestBed.createComponent(ExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
