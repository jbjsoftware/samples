import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pluralCase'
})
export class PluralCasePipe implements PipeTransform {

  transform(total: number, label: string): string {
    if (!label || !total) {
      return null;
    }

    if (total !== 1) {
      return `${label}s`;
    } else {
      return label;
    }
  }

}
