import { Component, OnDestroy, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subscription } from 'rxjs';
import {ShortcutService} from 'src/app/services/shortcut/shortcut.service';
import {StorageService} from 'src/app/services/storage/storage.service';
import {ToolHandler} from 'src/app/services/tool-handler/tool-handler.service';
import {FeatherToolHandlerService} from 'src/app/services/tool-handler/trace/feather/feather-tool-handler.service';
import {KeypressService} from 'src/app/services/tool-service/keypress.service';
import {FeatherService} from 'src/app/services/tool-service/trace/feather/feather.service';
import {ToolbarService} from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_FEATHER } from 'src/constant/cursor/constant';
import { FEATHER_OPTION_LINE_LENGTH, FEATHER_OPTION_ORIENTATION_ANGLE } from 'src/constant/storage/constant';
import {NUMBER_ONLY_REGEX} from 'src/constant/toolbar/constant';

@Component({
  selector: 'app-feather',
  templateUrl: './feather.component.html',
  styleUrls: ['./feather.component.scss'],
})
export class FeatherComponent implements OnInit, OnDestroy {
  form: FormGroup;
  angle: number;
  angleSubscription: Subscription;

  constructor(public storage: StorageService, public keypressValidator: KeypressService,
              public featherService: FeatherToolHandlerService, public toolbarService: ToolbarService,
              private formBuilder: FormBuilder, public shortcutService: ShortcutService, public  feather: FeatherService) {
    ToolHandler.currentToolType = this.featherService;
    this.angle = Number(this.storage.get(FEATHER_OPTION_ORIENTATION_ANGLE));
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      lineLength: [this.storage.get(FEATHER_OPTION_LINE_LENGTH), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
      orientationAngle: [this.angle, [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_FEATHER);
    this.angleSubscription = this.feather.getAngle().subscribe((angle) => {
      this.form.controls.orientationAngle.setValue(Math.abs(angle));
    });
  }

  ngOnDestroy() {
    this.angleSubscription.unsubscribe();
  }
}
