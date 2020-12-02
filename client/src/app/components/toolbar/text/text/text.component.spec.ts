import { async, ComponentFixture, TestBed } from '@angular/core/testing';

/*import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonToggle} from '@angular/material/button-toggle';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatFormField} from '@angular/material/form-field';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';*/
// import {NgModule} from '@angular/core';
import {NgModule} from '@angular/core';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../../constant/constant';
import {AppModule} from '../../../../app.module';
import {DataTextService} from '../../../../services/tool-service/text/dataShare/data-text.service';
import { TextComponent } from './text.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('TextComponent', () => {
  let component: TextComponent;
  let fixture: ComponentFixture<TextComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextComponent);
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

  it('updatePolicySize should send policy size when is called ', (done) => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getPolicySize().subscribe((size) => {
      if (size === component.form.controls.fontSize.value) {
        test = true;
        done();
      }
    });
    component.updateFontSize();
    expect(test).toBe(true);
  });

  it('setBold should send bold value when is called ', (done) => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getBold().subscribe((isBold) => {
      if (isBold === component.form.controls.bold.value) {
        test = true;
        done();
      }
    });
    component.setBold();
    expect(test).toBe(true);
  });

  it('setItalic should send Italic value when is called ', (done) => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getItalic().subscribe((isItalic) => {
      if (isItalic === component.form.controls.italic.value) {
        test = true;
        done();
      }
    });
    component.setItalic();
    expect(test).toBe(true);
  });

  it('setAnchor should send anchor value when is called ', (done) => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getAnchor().subscribe((option) => {
      if (option === component.form.controls.anchor.value) {
        test = true;
        done();
      }
    });
    component.setAnchor();
    expect(test).toBe(true);
  });

  it('setPolicy should send Policy option when is called ', (done) => {
    const service: DataTextService = TestBed.get(DataTextService);
    let test = false;
    service.getPolicy().subscribe((option) => {
      if (option === component.form.controls.fontStyle.value) {
        test = true;
        done();
      }
    });
    component.setFontStyle();
    expect(test).toBe(true);
  });
});
