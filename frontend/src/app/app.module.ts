import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RequestCompletedComponent } from './request-completed/request-completed.component';
import { RequestNotCompletedComponent } from './request-not-completed/request-not-completed.component';
import { HomeComponent } from './home/home.component';
import { YearPickerComponent } from './year-picker/year-picker.component';
import { FormCompletedComponent } from './form-completed/form-completed.component'
import { CityPageComponent } from './city-page/city-page.component';
import { DepartmentPageComponent } from './department-page/department-page.component';

import { HttpClientModule } from '@angular/common/http';
// import { NgChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import {MatDatepickerModule,MatDatepickerInputEvent} from '@angular/material/datepicker';

import {MatNativeDateModule} from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';


import {MatButtonModule } from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import {MatRadioModule} from '@angular/material/radio';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar'; 

import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar'; 
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list'; 
import {MatRippleModule} from '@angular/material/core'; 


/////////////////////
import {DatepickerComponent} from './datepicker/datepicker.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { LogoComponent } from './logo/logo.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
/////////////////////
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselItemDirective } from './carousel/carousel-item.directive';
import { CarouselItemElementDirective } from './carousel/carousel-item-element.directive';
import { ScoreDivComponent } from './form-divs/score-div/score-div.component';
import { TextDivComponent } from './form-divs/text-div/text-div.component';
import { DateDivComponent } from './form-divs/date-div/date-div.component';
import { DeniedEvaluationAccessComponent } from './denied-evaluation-access/denied-evaluation-access.component';


@NgModule({
  declarations: [
    AppComponent,
    RequestCompletedComponent,
    RequestNotCompletedComponent,
    HomeComponent,
    YearPickerComponent,
    FormCompletedComponent,
    CityPageComponent,
    DepartmentPageComponent,
    DatepickerComponent,
    LogoComponent,
    BarChartComponent,
    PieChartComponent,
    CarouselComponent,
    CarouselItemDirective,
    CarouselItemElementDirective,
    ScoreDivComponent,
    TextDivComponent,
    DateDivComponent,
    DeniedEvaluationAccessComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatButtonModule,
    MatStepperModule,
    MatIconModule,
    MatCardModule,
    MatSidenavModule,
    MatListModule,
    MatRippleModule,
    MatToolbarModule,
    BrowserAnimationsModule, 
    MatCheckboxModule,
    MatChipsModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    //
    HttpClientModule,
    NgxChartsModule,    
    MatSnackBarModule,
    

    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// Set-ExecutionPolicy RemoteSigned -Scope Process