import { Component, OnInit } from '@angular/core';
import { SelectionToolHandlerService } from 'src/app/services/tool-handler/selection/selection-tool-handler.service';
import { ToolHandler } from 'src/app/services/tool-handler/tool-handler.service';
import { SelectionService } from 'src/app/services/tool-service/selection/selection.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { CURSOR_SELECTION } from 'src/constant/cursor/constant';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.component.html',
  styleUrls: ['./selection.component.scss'],
})
export class SelectionComponent implements OnInit {

  isADrawingSelected: boolean;

  constructor(public selectionToolService: SelectionToolHandlerService,
              public selectionService: SelectionService, public toolbarService: ToolbarService) {
    ToolHandler.currentToolType = this.selectionToolService;
  }

  ngOnInit() {
    this.toolbarService.initiateHandlerUpdate();
    this.selectionService.isADrawingSelected().subscribe((isADrawingSelected) => {
      this.isADrawingSelected = isADrawingSelected;
    });
    this.toolbarService.sendCursorUpdate(CURSOR_SELECTION);
  }

}
