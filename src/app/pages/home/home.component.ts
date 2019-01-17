import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription, from } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { FilterSortService } from '../../core/filter-sort.service';
import { EventModel } from '../../core/models/event.model';
import { UtilsService } from '../../core/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  pageTitle = 'Events';
  eventListSub: Subscription;
  eventList: EventModel[];
  filteredEvents: Array<EventModel>;
  loading: boolean;
  error: boolean;
  query: '';

  constructor(
    private title: Title,
    public utils: UtilsService,
    private api: ApiService,
    public fs: FilterSortService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    this.eventListSub = this.api.getEvent$().subscribe(
      res => {
        this.eventList = res;
        this.filteredEvents = res;
        this.loading = false;
      },
      err => {
        console.error(err);
        this.loading = false;
        this.error = true;
      }
    );
  }

  searchEvents() {
    this.filteredEvents = this.fs.search(
      this.eventList,
      this.query,
      '_id',
      'mediumDate'
    );
  }

  resetQuery() {
    this.query = '';
    this.filteredEvents = this.eventList;
  }

  ngOnDestroy() {
    this.eventListSub.unsubscribe();
  }
}
