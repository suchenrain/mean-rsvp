import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { ApiService } from './core/api.service';
import { FilterSortService } from './core/filter-sort.service';
import { LoadingComponent } from './core/loading.component';
import { UtilsService } from './core/utils.service';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { AdminComponent } from './pages/admin/admin.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { EventDetailComponent } from './pages/event/event-detail/event-detail.component';
import { EventComponent } from './pages/event/event.component';
import { RsvpComponent } from './pages/event/rsvp/rsvp.component';
import { HomeComponent } from './pages/home/home.component';
import { RsvpFormComponent } from './pages/event/rsvp/rsvp-form/rsvp-form.component';
import { SubmittingComponent } from './core/forms/submitting.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CallbackComponent,
    LoadingComponent,
    AdminComponent,
    EventComponent,
    EventDetailComponent,
    RsvpComponent,
    RsvpFormComponent,
    SubmittingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [
    Title,
    AuthService,
    DatePipe,
    UtilsService,
    FilterSortService,
    ApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
