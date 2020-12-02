import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EraserToolHandlerService } from 'src/app/services/tool-handler/eraser/eraser-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_NONE } from 'src/constant/cursor/constant';
import { ERASER_DIAMETER } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';

@Component({
  selector: 'app-eraser',
  templateUrl: './eraser.component.html',
  styleUrls: ['./eraser.component.scss'],
})
export class EraserComponent implements OnInit {

  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService,
              public eraser: EraserToolHandlerService, private formBuilder: FormBuilder,
              public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    ToolHandler.currentToolType = this.eraser;
  }

  changeShortcutAccess(isEnabled: boolean) {
    this.shortcutService.changeShortcutAccess(isEnabled);
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      diameter: [this.storage.get(ERASER_DIAMETER), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_NONE);
  }
}
