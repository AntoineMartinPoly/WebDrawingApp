import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { COMPONENT_TEST_DEFAULT_TIMEOUT } from 'src/constant/constant';
import {AppModule} from '../../../../app.module';
import { SprayComponent } from './spray.component';

describe('SprayComponent', () => {
  let component: SprayComponent;
  let fixture: ComponentFixture<SprayComponent>;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = COMPONENT_TEST_DEFAULT_TIMEOUT;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
