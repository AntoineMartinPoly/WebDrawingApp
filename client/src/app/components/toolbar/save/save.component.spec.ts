import {ComponentFixture, TestBed} from '@angular/core/testing';
import {provideMagicalMock} from 'angular-testing-library/src/service_mock';
import * as fileSaver from 'file-saver';
import {of} from 'rxjs';
import * as sinon from 'sinon';
import {AppModule} from 'src/app/app.module';
import {SaveService} from 'src/app/services/tool-service/save/save.service';
import {FAKE_DRAWING, FAKE_ID, FAKE_NAME, FAKE_TAGS} from 'src/constant/tool-service/save/constant';
import {ImportMock} from 'ts-mock-imports';
import {GridService} from '../../../services/grid/grid.service';
import {SaveComponent} from './save.component';

describe('SaveComponent', () => {
  let component: SaveComponent;
  let fixture: ComponentFixture<SaveComponent>;
  let service: SaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
      providers: [
        provideMagicalMock(SaveService),

      ],
    })
      .compileComponents();
    const gridService: GridService = TestBed.get(GridService);
    spyOn(gridService, 'toggleGrid');
    service = TestBed.get(SaveService);
    (service.saveIdTagRelation as jasmine.Spy).and.returnValue(of());
    fixture = TestBed.createComponent(SaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('onSubmit should call generateDrawingObject, saveDrawing and createImageSrc and close', () => {
    const createSpy = service.createImageSrc as jasmine.Spy;
    createSpy.calls.reset();
    const generateDrawingSpy: jasmine.Spy = (service.generateDrawingObject as jasmine.Spy).and.returnValue(FAKE_DRAWING);
    const saveDrawingSpy: jasmine.Spy = (service.saveDrawing as jasmine.Spy).and.returnValue(of(FAKE_ID));
    component.onSubmit();
    expect(generateDrawingSpy).toHaveBeenCalled();
    expect(saveDrawingSpy).toHaveBeenCalled();
    expect(createSpy).toHaveBeenCalled();

  });

  it('remove should remove tag at specific ', () => {
    component.tagTable = FAKE_TAGS;
    component.remove(1);
    expect(component.tagTable.length).toBe(2);
    expect(component.tagTable[0]).toMatch('a');
    expect(component.tagTable[1]).toMatch('c');
  });

  it('addTag should push into tagTable if tag is not duplicate ', () => {
    component.tagTable = [];
    component.saveForm.value.tag = 'hello';
    (component.save.isTagDuplicated as jasmine.Spy).and.returnValue(false);
    component.addTag();
    expect(component.tagTable.length).toBe(1);
    expect(component.tagTable[0]).toMatch('hello');
  });

  it('addTag should do nothing if theres a duplicate ', () => {
    component.tagTable = [];
    component.saveForm.value.tag = 'hello';
    (component.save.isTagDuplicated as jasmine.Spy).and.returnValue(true);
    component.addTag();
    expect(component.tagTable.length).toBe(0);
  });

  describe('Local operations', () => {
    let saveAsMock: sinon.SinonStub;

    beforeAll(() => {
      saveAsMock = ImportMock.mockFunction(fileSaver, 'saveAs');
    });

    afterEach(() => {
      saveAsMock.reset();
    });

    it(`onLocalSave should call saveAs with a proprietary file`, () => {
      component.saveForm.value.name = FAKE_NAME;
      component.onLocalSave();
      expect(saveAsMock.calledOnce).toBe(true);
      expect(component.save.createProprietaryImageSrc as jasmine.Spy).toHaveBeenCalled();
    });
  });
});
