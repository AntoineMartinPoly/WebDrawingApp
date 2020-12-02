import { Component, OnDestroy, OnInit, } from '@angular/core';
import { MatSelectChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { TRACE_SELECTED } from 'src/constant/storage/constant';
import { TRACE_TABLE, TRACES } from 'src/constant/toolbar/trace/contant';
import { Shortcut } from 'src/interface/shortcut';

@Component({
  selector: 'app-trace',
  templateUrl: './trace.component.html',
  styleUrls: ['./trace.component.scss'],
})
export class TraceComponent implements OnInit, OnDestroy {

  traceNames: string[];
  traceTable: string[];
  traceSelector: string;
  shorcutSubscription: Subscription;

  constructor(public storage: StorageService, public shortcutService: ShortcutService) {
    this.traceNames = TRACES;
    this.traceTable = TRACE_TABLE;
    this.traceSelector = this.storage.get(TRACE_SELECTED);
  }

  unFocus(event: MatSelectChange): void {
    event.source.toggle();
  }

  changeShortcutAccess(isEnable: boolean) {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit() {
    this.traceSelector = this.storage.get(TRACE_SELECTED);
    this.shorcutSubscription =  this.shortcutService.getShortcut().subscribe((shortcut: Shortcut) => {
      this.traceSelector = this.shortcutService.handleTraceShortcut(shortcut, false) as string;
    });
  }

  ngOnDestroy(): void {
    this.shorcutSubscription.unsubscribe();
  }
}
