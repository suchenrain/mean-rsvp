import { AbstractControl, ValidatorFn } from '@angular/forms';
import { DATE_REGEX } from './formUtils.factory';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const dateStr = control.value;

    // First check for m/d/yyyy format
    // if pattern is wrong, dont validate yet
    if (!DATE_REGEX.test(dateStr)) {
      return null;
    }

    // days of months(will update for leap year)
    const monthLenghtArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    // object to return if date is invalid
    const invalidObj = { date: true };
    // parse the date input to integers
    const dateArr = dateStr.split('/');
    const month = parseInt(dateArr[0], 10);
    const day = parseInt(dateArr[1], 10);
    const year = parseInt(dateArr[2], 10);

    //today's date
    const now = new Date();

    // validate year and month
    if (year < now.getFullYear() || year > 3000 || month === 0 || month > 12) {
      return invalidObj;
    }
    // Adjust for leap year
    if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
      monthLenghtArr[1] = 29;
    }
    // validate day
    if (!(day > 0 && day <= monthLenghtArr[month - 1])) {
      return invalidObj;
    }

    // If date is properly formatted, check the date vs today to ensure future
    // This is done this way to account for new Date() shifting invalid
    // date strings. This way we know the string is a correct date first.
    const date = new Date(dateStr);
    if (date <= now) {
      return invalidObj;
    }
    return null;
  };
}
