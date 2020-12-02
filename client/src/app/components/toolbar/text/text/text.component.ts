import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { CURSOR_TEXT } from 'src/constant/cursor/constant';
import { TEXT_FONT_SIZE, TEXT_FONT_STYLE } from 'src/constant/storage/constant';
import { START } from 'src/constant/toolbar/text/constant';
import {StorageService} from '../../../../services/storage/storage.service';
import {TextToolHandlerService} from '../../../../services/tool-handler/text/text-tool-handler.service';
import {ToolHandler} from '../../../../services/tool-handler/tool-handler.service';
import {KeypressService} from '../../../../services/tool-service/keypress.service';
import {DataTextService} from '../../../../services/tool-service/text/dataShare/data-text.service';
import {ToolbarService} from '../../../../services/toolbar/toolbar.service';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  form: FormGroup;

  constructor( public textHandler: TextToolHandlerService, private formBuilder: FormBuilder,
               private dataText: DataTextService,  public keypressValidator: KeypressService,
               public storageService: StorageService,   public toolbarService: ToolbarService,
               public shortcutService: ShortcutService ) {
    ToolHandler.currentToolType = textHandler;
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      fontSize: [this.storageService.get(TEXT_FONT_SIZE), [Validators.min(1)]],
      bold: [false, ],
      italic: [false, ],
      anchor: [START, ],
      fontStyle: [this.storageService.get(TEXT_FONT_STYLE), ],

    });
    this.toolbarService.initiateHandlerUpdate();
    this.toolbarService.sendCursorUpdate(CURSOR_TEXT);
  }

  updateFontSize() {
    this.dataText.sendPolicySize(this.form.controls.fontSize.value);
    this.storageService.set(TEXT_FONT_SIZE, this.form.controls.fontSize.value);
  }
  setBold() {
    this.dataText.sendBold(this.form.controls.bold.value);
  }
  setItalic() {
    this.dataText.sendItalic(this.form.controls.italic.value);
  }
  setAnchor() {
    this.dataText.sendAnchor(this.form.controls.anchor.value);
   }

  setFontStyle() {
     this.dataText.sendPolicy(this.form.controls.fontStyle.value);
     this.storageService.set(TEXT_FONT_STYLE, this.form.controls.fontStyle.value);
   }
}
