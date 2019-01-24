import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../auth/auth.service';
import { ApiService } from '../../../../core/api.service';
import { GUESTS_REGEX } from '../../../../core/forms/formUtils.factory';
import { RsvpModel } from '../../../../core/models/rsvp.model';

@Component({
  selector: 'app-rsvp-form',
  templateUrl: './rsvp-form.component.html',
  styleUrls: ['./rsvp-form.component.scss']
})
export class RsvpFormComponent implements OnInit {
  @Input() eventId: string;
  @Input() rsvp: RsvpModel;
  @Output() submitRsvp = new EventEmitter();

  GUESTS_REGEX = GUESTS_REGEX;
  isEdit: boolean;
  formRsvp: RsvpModel;
  submitRsvpSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(private auth: AuthService, private api: ApiService) {}

  ngOnInit() {
    this.isEdit = !!this.rsvp;
    this._setFormRsvp();
  }

  private _setFormRsvp() {
    if (!this.isEdit) {
      // if creating a new RSVP,
      // create new RsvpModel with default data
      this.formRsvp = new RsvpModel(
        this.auth.userProfile.sub,
        this.auth.userProfile.name,
        this.eventId,
        null,
        0
      );
    } else {
      //if editing an existing RSVP,
      // create new RsvpModel from existing data
      this.formRsvp = new RsvpModel(
        this.rsvp.userId,
        this.rsvp.name,
        this.rsvp.eventId,
        this.rsvp.attending,
        this.rsvp.guests,
        this.rsvp.comments,
        this.rsvp._id
      );
    }
  }

  changeAttendanceSetGuests() {
    // if attendance changed to no, set guests: 0
    if (!this.formRsvp.attending) {
      this.formRsvp.guests = 0;
    }
  }

  onSubmit() {
    this.submitting = true;
    if (!this.isEdit) {
      this.submitRsvpSub = this.api
        .postRsvp$(this.formRsvp)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    } else {
      this.submitRsvpSub = this.api
        .editRsvp$(this.rsvp._id, this.formRsvp)
        .subscribe(
          data => this._handleSubmitSuccess(data),
          err => this._handleSubmitError(err)
        );
    }
  }

  private _handleSubmitSuccess(res) {
    const eventObj = {
      isEdit: this.isEdit,
      rsvp: res
    };
    this.submitRsvp.emit(eventObj);
    this.error = false;
    this.submitting = false;
  }

  private _handleSubmitError(err) {
    const eventObj = {
      isEdit: this.isEdit,
      error: err
    };
    this.submitRsvp.emit(eventObj);
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  ngOnDestroy() {
    this.submitRsvpSub && this.submitRsvpSub.unsubscribe();
  }
}
