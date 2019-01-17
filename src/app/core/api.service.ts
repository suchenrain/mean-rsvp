import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { Observable, throwError as ObservableThrowError, VirtualTimeScheduler } from 'rxjs';
import { EventModel } from './models/event.model';
import { ENV } from './env.config';
import { catchError } from 'rxjs/operators';
import { RsvpModel } from './models/rsvp.model';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  private get _authHeader(): string {
    return `Bearer ${this.auth.accessToken}`;
  }
  private get _setAuthHeader(): any {
    return {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    }
  }

  // GET list of public , future events
  getEvent$(): Observable<EventModel[]> {
    return this.http
      .get<EventModel[]>(`${ENV.BASE_API}events`)
      .pipe(
        catchError((error) => this._handleError(error))
      );
  }

  // GET all event - private and public (admin only)
  getAdminEvent$(): Observable<Array<EventModel>> {
    return this.http
      .get<Array<EventModel>>(`${ENV.BASE_API}events/admin`, this._setAuthHeader)
      .pipe(
        catchError(error => this._handleError(error))
      );
  }

  // GET event by id (login required)
  getEventById$(id: string): Observable<EventModel> {
    return this.http
      .get<EventModel>(`${ENV.BASE_API}event/${id}`, this._setAuthHeader)
      .pipe(
        catchError(error => this._handleError(error))
      )
  }

  // GET RSVPs by event ID (login required)
  getRsvpsByEventId$(eventId: string): Observable<RsvpModel[]> {
    return this.http
      .get<Array<RsvpModel>>(`${ENV.BASE_API}event/${eventId}/rsvps`, this._setAuthHeader)
      .pipe(
        catchError(error => this._handleError(error))
      )
  }

  private _handleError(err: HttpErrorResponse | any): Observable<any> {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return ObservableThrowError(errorMsg);
  }
}
