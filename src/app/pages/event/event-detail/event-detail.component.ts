import { Component, OnInit, Input } from '@angular/core';
import { EventModel } from '../../../core/models/event.model';
import { UtilsService } from '../../../core/utils.service';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {
  @Input() event: EventModel;

  constructor(public utils: UtilsService, public auth: AuthService) {}

  ngOnInit() {}
}
