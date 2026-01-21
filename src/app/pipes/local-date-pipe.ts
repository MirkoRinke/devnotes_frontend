import { Pipe, PipeTransform } from '@angular/core';
import { DateFormatterService } from '../services/date.formatter.service';

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {
  constructor(private dateFormatter: DateFormatterService) {}

  transform(value: string | Date | undefined, format: 'date' | 'time' | 'full' = 'full'): string {
    if (!value) {
      return '';
    }

    switch (format) {
      case 'date':
        return this.dateFormatter.toLocaleDateString(value);
      case 'time':
        return this.dateFormatter.toLocaleTimeString(value);
      default:
        return this.dateFormatter.toLocaleString(value);
    }
  }
}
