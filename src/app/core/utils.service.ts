import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';

@Injectable()
export class UtilsService {
  constructor(private datePipe: DatePipe) {}

  isLoaded(loading: boolean): boolean {
    return loading === false;
  }

  eventDates(start, end): string {
    const startDate = this.datePipe.transform(start, 'mediumDate');
    const endDate = this.datePipe.transform(end, 'mediumDate');

    if (startDate === endDate) {
      return startDate;
    } else {
      return `${startDate} - ${endDate}`;
    }
  }

  eventDatesTimes(start, end): string {
    const _shortDate = 'M/d/yyyy';
    const startDate = this.datePipe.transform(start, _shortDate);
    const startTime = this.datePipe.transform(start, 'shortTime');

    const endDate = this.datePipe.transform(end, _shortDate);
    const endTime = this.datePipe.transform(end, 'shortTime');

    if (startDate === endDate) {
      return `${startDate}, ${startTime} - ${endTime}`;
    } else {
      return `${startDate}, ${startTime} - ${endDate},${endTime}`;
    }
  }

  eventPast(eventEnd): boolean {
    //check if event has already ended
    const now = new Date();
    const then = new Date(eventEnd.toString());
    return now >= then;
  }

  tabIs(currentTab: string, tab: string): boolean {
    return currentTab === tab;
  }

  displayCount(guest: number): string {
    const persons = guest === 1 ? ' person' : ' people';
    return guest + persons;
  }

  showPlusOnes(guest: number): string {
    if (guest) {
      return `+${guest}`;
    }
  }

  booleanToText(bool: boolean): string {
    return bool ? 'Yes' : 'No';
  }
}
