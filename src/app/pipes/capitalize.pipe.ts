import {UpperCasePipe} from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalize'
})
export class CapitalizePipe implements PipeTransform {

  transform(str: string): string {
    const trueString = str.trim();
    return trueString.charAt(0).toUpperCase() + trueString.slice(1);
  }

}
