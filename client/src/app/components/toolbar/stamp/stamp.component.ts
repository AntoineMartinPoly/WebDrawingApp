import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { StampToolHandlerService } from 'src/app/services/tool-handler/stamp/stamp-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { ONE, THREE_HUNDRED_SIXTY } from 'src/constant/constant';
import { CURSOR_STAMP } from 'src/constant/cursor/constant';
import { STAMP_OPTIONS } from 'src/constant/stamp/constant';
import { STAMP_OPTION_IMAGE, STAMP_OPTION_ROTATE, STAMP_OPTION_SCALE } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { StampType } from 'src/interface/stamp/stamp';

@Component({
  selector: 'app-stamp',
  templateUrl: './stamp.component.html',
  styleUrls: ['./stamp.component.scss'],
})
export class StampComponent implements OnInit, OnDestroy {

  stampOptions: string[];
  stampSelected: string;
  stampType = StampType;
  form: FormGroup;

  constructor(public storage: StorageService,
              public stampHandler: StampToolHandlerService,
              public keypressValidator: KeypressService,
              private formBuilder: FormBuilder,
              public toolbarService: ToolbarService,
              public shortcutService: ShortcutService) {
    this.stampOptions = STAMP_OPTIONS;
    this.stampSelected = this.storage.get(STAMP_OPTION_IMAGE);
    ToolHandler.currentToolType = stampHandler;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      scale: [this.storage.get(STAMP_OPTION_SCALE), [Validators.required, Validators.min(ONE), Validators.pattern(NUMBER_ONLY_REGEX)]],
      rotation: [this.storage.get(STAMP_OPTION_ROTATE), [Validators.required, Validators.max(THREE_HUNDRED_SIXTY),
        Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_STAMP);
  }

  ngOnDestroy() {
    delete this.stampHandler.stamp;
  }
}
