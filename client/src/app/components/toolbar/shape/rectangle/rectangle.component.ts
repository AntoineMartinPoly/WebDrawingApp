import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { RectangleToolHandlerService } from 'src/app/services/tool-handler/shape/rectangle/rectangle-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_RECTANGLE } from 'src/constant/cursor/constant';
import { RECTANGLE_OPTION_CONTOUR, RECTANGLE_OPTION_TRACE } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { CONTOUR_OPTIONS } from 'src/constant/toolbar/shape/constant';

@Component({
  selector: 'app-rectangle',
  templateUrl: './rectangle.component.html',
  styleUrls: ['./rectangle.component.scss'],
})
export class RectangleComponent implements OnInit {

  traceSelector: string;
  traceOptions: string[] = CONTOUR_OPTIONS;
  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService, public rectServ: RectangleToolHandlerService,
              private formBuilder: FormBuilder, public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    this.traceSelector = this.storage.get(RECTANGLE_OPTION_TRACE);
    ToolHandler.currentToolType = this.rectServ;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(RECTANGLE_OPTION_CONTOUR), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_RECTANGLE);
  }
}
