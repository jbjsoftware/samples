import { Injectable } from '@angular/core';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class TimeZoneService {
  private currentTimeZone!: any;

  constructor() { }

  /**
   *
   * @returns User Time Zone Abbreviation
   */
  getCurrentUserTimeZone() {
    if (!this.currentTimeZone) {
      const timeZone = moment.tz.guess();
      const time = new Date();
      const timeStamp = time.getTime();
      this.currentTimeZone = moment?.tz?.zone(timeZone)?.abbr(timeStamp);
    }

    return this.currentTimeZone;
  }
}
