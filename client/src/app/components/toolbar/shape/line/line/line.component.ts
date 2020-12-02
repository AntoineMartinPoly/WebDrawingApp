import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { LineToolHandlerService } from 'src/app/services/tool-handler/shape/line/line-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_LINE } from 'src/constant/cursor/constant';
import { LINE_OPTION_DIAMETER, LINE_OPTION_JUNCTION, LINE_OPTION_STYLE, LINE_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { LINE_OPTION_JUNCTIONS, LINE_OPTION_STYLES } from 'src/constant/toolbar/shape/line/constant';

@Component({
  selector: 'app-line',
  templateUrl: './line.component.html',
  styleUrls: ['./line.component.scss'],
})
export class LineComponent implements OnInit {

  junctionsOptions: string[];
  traceOptions: string[];
  junctionSelector: string;
  traceSelector: string;
  form: FormGroup;

  constructor(public lineToolHandler: LineToolHandlerService, public keypressValidator: KeypressService,
              public storage: StorageService, private formBuilder: FormBuilder, public toolbarService: ToolbarService,
              public shortcutService: ShortcutService) {
    this.junctionsOptions = LINE_OPTION_JUNCTIONS;
    this.traceOptions = LINE_OPTION_STYLES;
    this.traceSelector = this.storage.get(LINE_OPTION_STYLE);
    this.junctionSelector = this.storage.get(LINE_OPTION_JUNCTION);
    ToolHandler.currentToolType = this.lineToolHandler;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(LINE_OPTION_THICKNESS), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
      diameter: [this.storage.get(LINE_OPTION_DIAMETER), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_LINE);
  }

}
