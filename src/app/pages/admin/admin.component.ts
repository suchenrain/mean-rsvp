import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ApiService } from 'src/app/core/api.service';
import { FilterSortService } from 'src/app/core/filter-sort.service';
import { UtilsService } from 'src/app/core/utils.service';
import { EventModel } from 'src/app/core/models/event.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  pageTitle = 'Admin';
  eventSub: Subscription;
  eventList: EventModel[];
  filteredEvents: EventModel[];
  loading: boolean;
  error: boolean;
  query = '';

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    public fs: FilterSortService
  ) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }
  private _getEventList() {
    this.loading = true;

    //get all (admin) events
    this.eventSub = this.api.getAdminEvent$().subscribe(
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
    this.eventSub.unsubscribe();
  }
}
