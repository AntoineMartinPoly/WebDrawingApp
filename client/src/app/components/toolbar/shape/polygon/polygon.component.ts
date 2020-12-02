import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { PolygonToolHandlerService } from 'src/app/services/tool-handler/shape/polygon/polygon-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_POLYGON } from 'src/constant/cursor/constant';
import { POLYGON_OPTION_CONTOUR, POLYGON_OPTION_SIDES, POLYGON_OPTION_TRACE } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { CONTOUR_OPTIONS } from 'src/constant/toolbar/shape/constant';

@Component({
  selector: 'app-polygon',
  templateUrl: './polygon.component.html',
  styleUrls: ['./polygon.component.scss'],
})
export class PolygonComponent implements OnInit {
  traceSelector: string;
  traceOptions: string[] = CONTOUR_OPTIONS;
  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService,
              public polygonServ: PolygonToolHandlerService, private formBuilder: FormBuilder,
              public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    this.traceSelector = this.storage.get(POLYGON_OPTION_TRACE);
    ToolHandler.currentToolType = this.polygonServ;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  updatePolygonNumberOfSides(event: MatSliderChange) {
    if (event.value) {
      this.storage.set(POLYGON_OPTION_SIDES, event.value.toString());
    }
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(POLYGON_OPTION_CONTOUR), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
      nbSides: [this.storage.get(POLYGON_OPTION_SIDES), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_POLYGON);
  }
}
