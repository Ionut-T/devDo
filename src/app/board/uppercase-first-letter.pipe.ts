import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transform first letter into uppercase
 */
@Pipe({
  name: 'uppercaseFirstLetter'
})
export class UppercaseFirstLetterPipe implements PipeTransform {
  transform(value: any): any {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
