import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventModel } from '../../core/models/event.model';
import { Title } from '@angular/platform-browser';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../core/api.service';
import { FilterSortService } from '../../core/filter-sort.service';
import { UtilsService } from '../../core/utils.service';

@Component({
  selector: 'app-my-rsvps',
  templateUrl: './my-rsvps.component.html',
  styleUrls: ['./my-rsvps.component.scss']
})
export class MyRsvpsComponent implements OnInit {
  pageTitle = 'My RSVPS';
  loggedInSub: Subscription;
  eventListSub: Subscription;
  eventList: EventModel[];
  loading: boolean;
  error: boolean;
  userIdp: string;

  constructor(
    private title: Title,
    public auth: AuthService,
    private api: ApiService,
    public fs: FilterSortService,
    public utils: UtilsService
  ) {}

  ngOnInit() {
    this.loggedInSub = this.auth.loggedIn$.subscribe(loggedIn => {
      this.loading = true;
      if (loggedIn) {
        this._getEventList();
      }
    });
    this.title.setTitle(this.pageTitle);
  }

  private _getEventList() {
    // Get events user has Rsvped to
    this.eventListSub = this.api
      .getUserEvents$(this.auth.userProfile.sub)
      .subscribe(
        res => {
          this.eventList = res;
          this.loading = false;
        },
        err => {
          console.error(err);
          this.loading = false;
          this.error = true;
        }
      );
  }

  ngOnDestory() {
    this.loggedInSub.unsubscribe();
    this.eventListSub.unsubscribe();
  }
}
