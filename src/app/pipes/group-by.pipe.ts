import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {

  transform<T, V>(value: T[], sortFn: (t: T) => [V, T]): Map<V, T[]> {
    if (!Array.isArray(value)) {
      return value;
    }

    const map = new Map<V, T[]>();

    for (const item of value) {
      const [key, value] = sortFn(item);
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)?.push(value);
    }

    console.log(map);
    return map;
  }

}
