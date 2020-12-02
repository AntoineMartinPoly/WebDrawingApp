import { Component, OnInit } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { PipetteToolHandlerService } from 'src/app/services/tool-handler/pipette/pipette-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_PIPETTE } from 'src/constant/cursor/constant';

@Component({
  selector: 'app-pipette',
  templateUrl: './pipette.component.html',
  styleUrls: ['./pipette.component.scss'],
})
export class PipetteComponent implements OnInit {

  constructor(public pipetteToolHandler: PipetteToolHandlerService,
              public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
                ToolHandler.currentToolType = pipetteToolHandler;
              }

  ngOnInit() {
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_PIPETTE);
  }

}
