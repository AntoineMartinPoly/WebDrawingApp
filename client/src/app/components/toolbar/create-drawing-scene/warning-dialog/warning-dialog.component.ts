import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';

@Component({
  selector: 'app-warning-dialog',
  templateUrl: './warning-dialog.component.html',
  styleUrls: ['./warning-dialog.component.scss'],
})
export class WarningDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public window: string,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WarningDialogComponent>,
    public toolbarService: ToolbarService,
    private shortcutService: ShortcutService) { }

  onCancel(): void {
    this.shortcutService.changeShortcutAccess(true);
    this.dialogRef.close();
  }

  onAccept(): void {
    this.toolbarService.sendWindow(this.window);
    this.dialogRef.close();
  }
}
