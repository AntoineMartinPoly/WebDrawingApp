import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { EllipseToolHandlerService } from 'src/app/services/tool-handler/shape/ellipse/ellipse-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_ELLIPSE } from 'src/constant/cursor/constant';
import { ELLIPSE_OPTION_CONTOUR, ELLIPSE_OPTION_TRACE } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { CONTOUR_OPTIONS } from 'src/constant/toolbar/shape/constant';

@Component({
  selector: 'app-ellipse',
  templateUrl: './ellipse.component.html',
  styleUrls: ['./ellipse.component.scss'],
})
export class EllipseComponent implements OnInit {
  traceSelector: string;
  traceOptions: string[];
  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService,
              public ellipseService: EllipseToolHandlerService, private formBuilder: FormBuilder,
              public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    this.traceSelector = this.storage.get(ELLIPSE_OPTION_CONTOUR);
    ToolHandler.currentToolType = ellipseService;
    this.traceOptions = CONTOUR_OPTIONS;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(ELLIPSE_OPTION_TRACE), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_ELLIPSE);
  }

}
