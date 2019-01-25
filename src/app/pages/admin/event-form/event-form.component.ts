import { Component, OnInit, Input } from '@angular/core';
import { EventModel } from '../../../core/models/event.model';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {
  @Input() event: EventModel;

  constructor() {}

  ngOnInit() {}
}
