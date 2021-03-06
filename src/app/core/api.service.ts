import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError as ObservableThrowError } from 'rxjs';
import { catchError, retryWhen } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { ENV } from './env.config';
import { EventModel } from './models/event.model';
import { RsvpModel } from './models/rsvp.model';

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private get _authHeader(): string {
    return `Bearer ${this.auth.accessToken}`;
  }
  private get _setAuthHeader(): any {
    return {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    };
  }

  // GET list of public , future events
  getEvent$(): Observable<EventModel[]> {
    return this.http
      .get<EventModel[]>(`${ENV.BASE_API}events`)
      .pipe(catchError(error => this._handleError(error)));
  }

  // GET all event - private and public (admin only)
  getAdminEvent$(): Observable<Array<EventModel>> {
    return this.http
      .get<Array<EventModel>>(
        `${ENV.BASE_API}events/admin`,
        this._setAuthHeader
      )
      .pipe(catchError(error => this._handleError(error)));
  }

  // GET event by id (login required)
  getEventById$(id: string): Observable<EventModel> {
    return this.http
      .get<EventModel>(`${ENV.BASE_API}event/${id}`, this._setAuthHeader)
      .pipe(catchError(error => this._handleError(error)));
  }

  // GET RSVPs by event ID (login required)
  getRsvpsByEventId$(eventId: string): Observable<RsvpModel[]> {
    return this.http
      .get<Array<RsvpModel>>(
        `${ENV.BASE_API}event/${eventId}/rsvps`,
        this._setAuthHeader
      )
      .pipe(catchError(error => this._handleError(error)));
  }

  // Post New RSVP(login required)
  postRsvp$(rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .post<RsvpModel>(`${ENV.BASE_API}rsvp/new`, rsvp, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  //update existing RSVP(login required)
  editRsvp$(id: string, rsvp: RsvpModel): Observable<RsvpModel> {
    return this.http
      .put(`${ENV.BASE_API}rsvp/${id}`, rsvp, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  // POST new event(admin only)
  postEvent$(event: EventModel): Observable<EventModel> {
    return this.http
      .post<EventModel>(`${ENV.BASE_API}event/new`, event, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  // PUT existing event admin only
  editEvent$(id: string, event: EventModel): Observable<EventModel> {
    return this.http
      .put<EventModel>(`${ENV.BASE_API}event/${id}`, event, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  // DELETE existing event and all associated RSVPs (admin only)
  deleteEvent$(id: string): Observable<any> {
    return this.http
      .delete(`${ENV.BASE_API}event/${id}`, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  // GET all events a specific user has RSVPed to (login required)
  getUserEvents$(userId: string): Observable<EventModel[]> {
    return this.http
      .get<EventModel[]>(`${ENV.BASE_API}events/${userId}`, this._setAuthHeader)
      .pipe(catchError(err => this._handleError(err)));
  }

  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return ObservableThrowError(errorMsg);
  }
}
