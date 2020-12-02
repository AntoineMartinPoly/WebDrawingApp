import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { PencilToolHandlerService } from 'src/app/services/tool-handler/trace/pencil/pencil-tool-handler.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_PENCIL } from 'src/constant/cursor/constant';
import { PENCIL_OPTION_THICKNESS } from 'src/constant/storage/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';

@Component({
  selector: 'app-pencil',
  templateUrl: './pencil.component.html',
  styleUrls: ['./pencil.component.scss'],
})
export class PencilComponent implements OnInit {

  form: FormGroup;

  constructor(public storage: StorageService, public keypressValidator: KeypressService, public pencilServ: PencilToolHandlerService,
              private formBuilder: FormBuilder, public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
    ToolHandler.currentToolType = this.pencilServ;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      thickness: [this.storage.get(PENCIL_OPTION_THICKNESS), [Validators.required, Validators.pattern(NUMBER_ONLY_REGEX)]],
    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_PENCIL);
  }
}
