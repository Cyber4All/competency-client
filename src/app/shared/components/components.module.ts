import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompetencyCardComponent } from './competency-card/competency-card.component';
import { ActorCardComponent } from './competency-card/components/actor-card/actor-card.component';
import { BehaviorCardComponent } from './competency-card/components/behavior-card/behavior-card.component';
import { ConditionCardComponent } from './competency-card/components/condition-card/condition-card.component';
import { DegreeCardComponent } from './competency-card/components/degree-card/degree-card.component';
import { EmployabilityCardComponent } from './competency-card/components/employability-card/employability-card.component';
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
import  {SnackbarComponent} from './snackbar/snackbar.component';
import { NotesCardComponent } from './competency-card/components/notes-card/notes-card.component';
import { BannerComponent } from './banner/banner.component';
import { PrimaryNavComponent } from './primary-nav/primary-nav.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    CompetencyCardComponent,
    ActorCardComponent,
    BehaviorCardComponent,
    ConditionCardComponent,
    DegreeCardComponent,
    EmployabilityCardComponent,
    FileUploadComponent,
    NotesCardComponent,
    SnackbarComponent,
    BannerComponent,
    PrimaryNavComponent,
    SearchBarComponent,
    UserMenuComponent
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
    RouterModule
  ],
  exports: [
    CompetencyCardComponent,
    FileUploadComponent,
    BannerComponent,
    PrimaryNavComponent,
    SearchBarComponent,
    UserMenuComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ComponentsModule { }
