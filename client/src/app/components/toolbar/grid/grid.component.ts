import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material';
import { Subscription } from 'rxjs';
import { GridService } from 'src/app/services/grid/grid.service';
import { ShortcutService } from 'src/app/services/shortcut/shortcut.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { KeypressService } from 'src/app/services/tool-service/keypress.service';
import { ToolbarService } from 'src/app/services/toolbar/toolbar.service';
import { ZERO } from 'src/constant/constant';
import { MAGNETISM_STATE, OPTION_GRID_OPACITY, OPTION_GRID_SHOWN, OPTION_GRID_SIZE } from 'src/constant/storage/constant';
import { FALSE, TRUE } from 'src/constant/svg/constant';
import { NUMBER_ONLY_REGEX } from 'src/constant/toolbar/constant';
import { HIDDEN, SIZE, TOGGLE_COLOR_PICKER, TOGGLE_GRID, TOGGLE_MAGNETISM, VISIBLE } from 'src/constant/toolbar/grid/constant';
import { ONE } from 'src/constant/toolbar/shape/constant';

@Component({
  selector: 'app-grid-surface',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})

export class GridComponent implements OnInit, OnDestroy {
  form: FormGroup;
  size: number;
  isShown: boolean;
  isMagnetism: boolean;
  isColor: boolean;
  shortcutSubscription: Subscription;

  @HostListener('window:beforeunload', ['$event'])
    toggleOff() {
      this.storage.set(OPTION_GRID_SHOWN, HIDDEN);
      this.storage.set(MAGNETISM_STATE, FALSE);
    }

  constructor(
    private formBuilder: FormBuilder,
    public storage: StorageService,
    public gridService: GridService,
    public keypressValidator: KeypressService,
    public shortcutService: ShortcutService,
    public toolbarService: ToolbarService,
  ) {
    this.isShown = this.storage.get(OPTION_GRID_SHOWN) === VISIBLE;
    this.isMagnetism = this.storage.get(MAGNETISM_STATE) === TRUE;
  }

  changeShortcutAccess(isEnable: boolean): void {
    this.shortcutService.changeShortcutAccess(isEnable);
  }

  ngOnInit(): void {
    this.isColor = true;
    this.toolbarService.sendColorTabUpdate(true);
    this.form = this.formBuilder.group({
      size: [
        this.storage.get(OPTION_GRID_SIZE),
        [
          Validators.required,
          Validators.min(ONE),
          Validators.pattern(NUMBER_ONLY_REGEX),
        ],
      ],
      opacity: [
        this.storage.get(OPTION_GRID_OPACITY),
        [
          Validators.required,
          Validators.min(ZERO),
          Validators.max(ONE),
          Validators.pattern(NUMBER_ONLY_REGEX),
        ],
      ],
    });
    this.shortcutListener();
  }

  ngOnDestroy(): void {
    this.shortcutSubscription.unsubscribe();
    this.toolbarService.sendColorTabUpdate(false);
  }

  updateSize(): void {
    this.size = (this.form.get(SIZE) as AbstractControl).value;
    this.storage.set(
      OPTION_GRID_SIZE, this.size ? this.size.toString() : ZERO.toString(),
    );
    this.gridService.updateSize();
  }

  updateOpacity(event: MatSliderChange): void {
    if (event.value) {
      this.storage.set(
        OPTION_GRID_OPACITY,
        event.value.toString(),
      );
      this.gridService.updateOpacity(event.value);
    }
  }

  toggleGrid(): void {
    this.gridService.toggleGrid(this.isShown);
    this.storage.set(OPTION_GRID_SHOWN, this.isShown ? VISIBLE : HIDDEN);
  }

  toggleMagnetism(): void {
    this.storage.set(MAGNETISM_STATE, this.isMagnetism ? TRUE : FALSE);
  }

  updateColorTab(): void {
    this.toolbarService.sendColorTabUpdate(this.isColor);
  }

  shortcutListener(): void {
    this.shortcutSubscription = this.shortcutService.getGridOption().subscribe((option: number) => {
      switch (option) {
        case TOGGLE_COLOR_PICKER : {
          this.isColor = !this.isColor;
          this.updateColorTab();
          break;
        }
        case TOGGLE_GRID : {
          this.isShown = this.storage.get(OPTION_GRID_SHOWN) === VISIBLE;
          break;
        }
        case TOGGLE_MAGNETISM : {
          this.isMagnetism = this.storage.get(MAGNETISM_STATE) === TRUE;
          break;
        }
        default: break;
      }
    });
  }

}
