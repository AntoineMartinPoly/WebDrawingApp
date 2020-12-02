import { Component, OnInit } from '@angular/core';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ColorizerToolHandlerService } from 'src/app/services/tool-handler/colorizer/colorizer-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_COLORIZER } from 'src/constant/cursor/constant';

@Component({
  selector: 'app-colorizer',
  templateUrl: './colorizer.component.html',
  styleUrls: ['./colorizer.component.scss'],
})
export class ColorizerComponent implements OnInit {

  constructor(public colorizerToolHandler: ColorizerToolHandlerService,
              public toolbarService: ToolbarService, public shortcutService: ShortcutService) {
                ToolHandler.currentToolType = colorizerToolHandler;
              }

  ngOnInit() {
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_COLORIZER);
  }

}
