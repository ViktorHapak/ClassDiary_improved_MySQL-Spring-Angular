import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';

import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { ButtonHoverDirective } from './_directives/button-hover.directive';
import { StudentsComponent } from './home/students/students.component';
import { LecturingComponent } from './home/lecturing/lecturing.component';
import { UsersComponent } from './home/users/users.component';
import { GradesComponent } from './grades/grades.component';
import { StudentDetailsComponent } from './home/students/student-details/student-details.component';
import { UserDetailsComponent } from './home/users/user-details/user-details.component';
import { LecturingDetailsComponent } from './home/lecturing/lecturing-details/lecturing-details.component';
import { SubjectDetailsComponent } from './home/lecturing/subject-details/subject-details.component';
import { GradeListSlicerPipe } from './_pipes/grade-list-slicer.pipe';
import { GalleryComponent } from './home/students/gallery/gallery.component';
import { ImgDetailsComponent } from './home/students/gallery/img-details/img-details.component';
import { CalendarComponent } from './_helper_components/calendar/calendar.component';
import { DateFormatterPipe } from './_pipes/date-formatter.pipe';
import { MonthFormatterPipe } from './_pipes/month-formatter.pipe';
import {WeekFormatterPipe} from './_pipes/weekformatter.pipe';
import { RolenamePipe } from './_pipes/rolename.pipe';
import { StoreModule } from '@ngrx/store';
import {messageReducer} from "./_states/message.reducer";
import { EffectsModule } from '@ngrx/effects';
import {closeEffect, messageEffect} from "./_states/message.effects";
import { MessageSlicerPipe } from './_pipes/message-slicer.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ButtonHoverDirective,
    StudentsComponent,
    LecturingComponent,
    UsersComponent,
    GradesComponent,
    StudentDetailsComponent,
    UserDetailsComponent,
    LecturingDetailsComponent,
    SubjectDetailsComponent,
    GradeListSlicerPipe,
    GalleryComponent,
    ImgDetailsComponent,
    CalendarComponent,
    DateFormatterPipe,
    MonthFormatterPipe,
    WeekFormatterPipe,
    RolenamePipe,
    MessageSlicerPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    StoreModule.forRoot({message: messageReducer}),
    EffectsModule.forRoot([{messageEffect}, {closeEffect}])
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
