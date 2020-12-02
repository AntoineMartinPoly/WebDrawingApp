import { NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { TutorialService } from 'src/app/services/tutorial/tutorial.service';
import {COMPONENT_TEST_DEFAULT_TIMEOUT} from '../../../../constant/constant';
import { TutorialComponent } from './tutorial.component';

@NgModule({
  imports: [
    AppModule,
  ],
})
class DialogTestModule { }

describe('TutorialComponent', () => {
  let component: TutorialComponent;
  let fixture: ComponentFixture<TutorialComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DialogTestModule],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create isTutorialActive and should be set to false', () => {
    expect(component).toBeTruthy();
    expect(component.deactivateTutorial).toBe(false);
  });

  it('ngOnDestroy should call tutorial service function saveIsTutorialActive', () => {
    const tutorial: TutorialService = TestBed.get(TutorialService);
    const tutorialSpy: jasmine.Spy = spyOn(tutorial, 'saveIsTutorialActive');
    component.ngOnDestroy();
    expect(tutorialSpy).toHaveBeenCalled();
  });

});
