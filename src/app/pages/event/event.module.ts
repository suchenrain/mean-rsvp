import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoreModule } from '../../core/core.module';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { EventComponent } from './event.component';
import { EVENT_ROUTES } from './event.routes';
import { RsvpFormComponent } from './rsvp/rsvp-form/rsvp-form.component';
import { RsvpComponent } from './rsvp/rsvp.component';

@NgModule({
  imports: [CommonModule, CoreModule, RouterModule.forChild(EVENT_ROUTES)],
  declarations: [
    EventComponent,
    EventDetailComponent,
    RsvpComponent,
    RsvpFormComponent
  ]
})
export class EventModule {}
