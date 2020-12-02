import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { BrushToolHandlerService } from 'src/app/services/tool-handler/trace/brush/brush-tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_BRUSH } from 'src/constant/cursor/constant';
import { BRUSH_OPTION_PATTERN, BRUSH_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { PatternType } from 'src/interface/trace/brush';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss'],
})
export class BrushComponent implements OnInit {

  patternSelected: PatternType;
  patterns = PatternType;
  keys = Object.keys;
  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService, public brushService: BrushToolHandlerService,
              private formBuilder: FormBuilder, public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    this.patternSelected = this.storage.get(BRUSH_OPTION_PATTERN) as PatternType;
    ToolHandler.currentToolType = this.brushService;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(BRUSH_OPTION_THICKNESS), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_BRUSH);
  }
}
