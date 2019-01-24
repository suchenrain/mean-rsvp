import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../core/api.service';
import { EventModel } from '../../core/models/event.model';
import { UtilsService } from '../../core/utils.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent implements OnInit {
  pageTitle: string;
  id: string;
  loggedInSub: Subscription;
  routeSub: Subscription;
  tabSub: Subscription;
  eventSub: Subscription;
  event: EventModel;
  loading: boolean;
  error: boolean;
  tab: string;
  eventPast: boolean;

  constructor(
    private route: ActivatedRoute,
    public auth: AuthService,
    private api: ApiService,
    public utils: UtilsService,
    private title: Title
  ) {}

  ngOnInit() {
    this.loggedInSub = this.auth.loggedIn$.subscribe(loggedIn => {
      this.loading = true;
      if (loggedIn) {
        this._routeSubs();
      }
    });
  }

  private _routeSubs() {
    // set event Id from route params and subscribe
    this.routeSub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this._getEvent();
    });

    // subscribe to query params to watch for tab changes
    this.tabSub = this.route.queryParams.subscribe(queryParams => {
      this.tab = queryParams['tab'] || 'details';
    });
  }

  private _getEvent() {
    this.loading = true;
    // Get event by ID
    this.eventSub = this.api.getEventById$(this.id).subscribe(
      res => {
        this.event = res;
        this._setPageTitle(this.event.title);
        this.loading = false;
        this.eventPast = this.utils.eventPast(this.event.endDatetime);
      },
      err => {
        console.error(err);
        this.loading = false;
        this.error = true;
        this._setPageTitle('Event Details');
      }
    );
  }

  private _setPageTitle(title: string) {
    this.pageTitle = title;
    this.title.setTitle(title);
  }

  ngOnDestory() {
    this.routeSub.unsubscribe();
    this.tabSub.unsubscribe();
    this.eventSub.unsubscribe();
  }
}
