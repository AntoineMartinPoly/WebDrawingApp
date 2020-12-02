import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule, MatCardModule,
  MatDividerModule, MatFormFieldModule, MatGridListModule,
  MatInputModule, MatListModule, MatProgressSpinnerModule, MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTooltipModule,
} from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingSurfaceComponent } from './components/drawing/drawing-surface/drawing-surface.component';
import { MainVueComponent } from './components/main-vue/main-vue.component';
import { TutorialComponent } from './components/main-vue/tutorial/tutorial.component';
import {ActionComponent} from './components/toolbar/action/action.component';
import { BucketComponent } from './components/toolbar/bucket/bucket.component';
import { BwSelectorComponent } from './components/toolbar/color-picker/bw-selector/bw-selector.component';
import { ColorPickerComponent } from './components/toolbar/color-picker/color-picker.component';
import { ColorSliderComponent } from './components/toolbar/color-picker/color-slider/color-slider.component';
import { OpacitySliderComponent } from './components/toolbar/color-picker/opacity-slider/opacity-slider.component';
import { ColorizerComponent } from './components/toolbar/colorizer/colorizer.component';
import { CreateDrawingSceneComponent } from './components/toolbar/create-drawing-scene/create-drawing-scene.component';
import { WarningDialogComponent } from './components/toolbar/create-drawing-scene/warning-dialog/warning-dialog.component';
import { EraserComponent } from './components/toolbar/eraser/eraser.component';
import { ExportComponent } from './components/toolbar/export/export.component';
import { GridComponent } from './components/toolbar/grid/grid.component';
import { PipetteComponent } from './components/toolbar/pipette/pipette.component';
import { SaveComponent } from './components/toolbar/save/save.component';
import { SelectionComponent } from './components/toolbar/selection/selection.component';
import { EllipseComponent } from './components/toolbar/shape/ellipse/ellipse.component';
import { LineComponent } from './components/toolbar/shape/line/line/line.component';
import { PolygonComponent } from './components/toolbar/shape/polygon/polygon.component';
import { RectangleComponent } from './components/toolbar/shape/rectangle/rectangle.component';
import { ShapeComponent } from './components/toolbar/shape/shape.component';
import { StampComponent } from './components/toolbar/stamp/stamp.component';
import { TextComponent } from './components/toolbar/text/text/text.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { BrushComponent } from './components/toolbar/trace/brush/brush.component';
import {FeatherComponent} from './components/toolbar/trace/feather/feather.component';
import {PenComponent} from './components/toolbar/trace/pen/pen.component';
import { PencilComponent } from './components/toolbar/trace/pencil/pencil.component';
import { SprayComponent } from './components/toolbar/trace/spray/spray.component';
import { TraceComponent } from './components/toolbar/trace/trace.component';
import { ViewDrawingComponent } from './components/toolbar/view-drawing/view-drawing.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    MainVueComponent,
    MainVueComponent,
    TutorialComponent,
    DrawingSurfaceComponent,
    TraceComponent,
    ShapeComponent,
    CreateDrawingSceneComponent,
    RectangleComponent,
    PencilComponent,
    ColorPickerComponent,
    ColorSliderComponent,
    BwSelectorComponent,
    OpacitySliderComponent,
    BrushComponent,
    WarningDialogComponent,
    SaveComponent,
    EllipseComponent,
    PolygonComponent,
    StampComponent,
    LineComponent,
    ViewDrawingComponent,
    GridComponent,
    PenComponent,
    EraserComponent,
    TextComponent,
    ActionComponent,
    SelectionComponent,
    SprayComponent,
    BucketComponent,
    PipetteComponent,
    ColorizerComponent,
    ExportComponent,
    FeatherComponent,
  ],
  entryComponents: [
    TutorialComponent,
    CreateDrawingSceneComponent,
    WarningDialogComponent,
    SaveComponent,
    ViewDrawingComponent,
    ExportComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatIconModule,
    AngularSvgIconModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    DragDropModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    MatCardModule,
    FlexLayoutModule,
    MatTooltipModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatRadioModule,
    MatDividerModule,
    MatSidenavModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    MatCheckboxModule,
    MatButtonToggleModule,
  ],
  providers: [
    { provide: MatDialogRef, useValue: { open: () => true }},
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
