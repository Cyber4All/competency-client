import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyCardComponent } from './competency-card/competency-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from '../../app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { SnackbarComponent } from './snackbar/snackbar.component';
import { CompetencyBuilderComponent } from './competency-builder/competency-builder.component';
import { ActorBuilderComponent } from './competency-builder/components/actor-builder/actor-builder.component';
import { BehaviorBuilderComponent } from './competency-builder/components/behavior-builder/behavior-builder.component';
import { ContextBuilderComponent } from './competency-builder/components/context-builder/context-builder.component';
import { DegreeBuilderComponent } from './competency-builder/components/degree-builder/degree-builder.component';
import { EmployabilityBuilderComponent } from './competency-builder/components/employability-builder/employability-builder.component';
import { NotesBuilderComponent } from './competency-builder/components/notes-builder/notes-builder.component';
import { BannerComponent } from './banner/banner.component';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { BuilderNavbarComponent } from './competency-builder/components/builder-navbar/builder-navbar.component';
@NgModule({
  declarations: [
    CompetencyCardComponent,
    FileUploadComponent,
    CompetencyBuilderComponent,
    ActorBuilderComponent,
    BehaviorBuilderComponent,
    ContextBuilderComponent,
    DegreeBuilderComponent,
    EmployabilityBuilderComponent,
    NotesBuilderComponent,
    SnackbarComponent,
    BannerComponent,
    BuilderNavbarComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatExpansionModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatDividerModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatChipsModule,
    SharedDirectivesModule,
    VirtualScrollerModule,
  ],
  exports: [
    CompetencyCardComponent,
    FileUploadComponent,
    BannerComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ComponentsModule { }
