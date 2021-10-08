
import { Pipe, PipeTransform } from '@angular/core';

import moment from 'moment-timezone';
import { TimeZoneService } from '../services/time-zone.service';

@Pipe({
  name: 'localeDateTime'
})
export class LocaleDateTimePipe implements PipeTransform {
  userTimeZone: string;

  constructor(private timeZoneService: TimeZoneService) {
    this.userTimeZone = this.timeZoneService.getCurrentUserTimeZone();
  }

  transform(value: any, format = 'll', includeTimeZone = false): any {
    if (value) {
      const localeDT = moment.utc(value).toDate();
      const formattedDateTime = moment(localeDT).format(format);
      return formattedDateTime + (includeTimeZone ? ` ${this.userTimeZone}` : '');
    } else {
      return null;
    }
  }
}
