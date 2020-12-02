import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { PenToolHandlerService } from 'src/app/services/tool-handler/trace/pen/pen-tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_PEN } from 'src/constant/cursor/constant';
import { PEN_OPTION_THICKNESS_MAX, PEN_OPTION_THICKNESS_MIN } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';

@Component({
  selector: 'app-pen',
  templateUrl: './pen.component.html',
  styleUrls: ['./pen.component.scss'],
})
export class PenComponent implements OnInit {

  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService,
              public penService: PenToolHandlerService, public toolbarService: ToolbarService,
              private formBuilder: FormBuilder, public shortcutService: ShortcutService) {
    ToolHandler.currentToolType = this.penService;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thicknessMax: [this.storage.get(PEN_OPTION_THICKNESS_MAX), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
      thicknessMin: [this.storage.get(PEN_OPTION_THICKNESS_MIN), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_PEN);
  }
}
