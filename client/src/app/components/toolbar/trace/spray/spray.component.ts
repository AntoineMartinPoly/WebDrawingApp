import {Component, OnDestroy, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { CURSOR_SPRAY } from 'src/constant/cursor/constant';
import {MAX_RADIUS, MIN_RADIUS, ONE_SECOND_IN_MILLIS} from 'src/constant/spray/constant';
import { SPRAY_INTERVAL_PERIOD, SPRAY_RADIUS } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import {ToolHandler} from '../../../../services/tool-handler/tool-handler.service';
import {SprayToolHandlerService} from '../../../../services/tool-handler/trace/spray/spray-tool-handler.service';
import {SprayService} from '../../../../services/tool-service/trace/spray/spray.service';
import {ToolbarService} from '../../../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-spray',
  templateUrl: './spray.component.html',
  styleUrls: ['./spray.component.scss'],
})
export class SprayComponent implements OnInit, OnDestroy {

  form: FormGroup;

  constructor(private sprayService: SprayService, public sprayToolHandler: SprayToolHandlerService,
              public toolbarService: ToolbarService, public storage: StorageService,
              private formBuilder: FormBuilder, public shortcutService: ShortcutService,
              public keypressValidator: KeypressService) {
    ToolHandler.currentToolType = this.sprayToolHandler;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  setInterval() {
    this.sprayService.intervalPeriod = ONE_SECOND_IN_MILLIS / this.form.value.interval;
    this.sprayService.saveState();
  }

  initIntervalBar(): string {
    return (ONE_SECOND_IN_MILLIS / Number(this.storage.get(SPRAY_INTERVAL_PERIOD))).toString();
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      radius: [this.storage.get(SPRAY_RADIUS), [
          Validators.required,
          Validators.min(MIN_RADIUS),
          Validators.max(MAX_RADIUS),
          Validators.pattern(NUMBER_ONLY_REGEX),
      ],
      ],
      interval: [
        this.initIntervalBar(),
        [
          Validators.required,
          Validators.pattern(NUMBER_ONLY_REGEX),
        ],
      ],
    });
    this.sprayService.loadState();
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_SPRAY);
  }

  ngOnDestroy(): void {
    this.sprayService.saveState();
  }
}
