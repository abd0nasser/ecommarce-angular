import { Pipe, PipeTransform } from '@angular/core';
/** 1500 -> "1,500 EGP" */
@Pipe({ name: 'egp' })
export class EgpPipe implements PipeTransform {
  transform(value: number | null | undefined): string { return value == null ? '' : `${Number(value).toLocaleString('en-US')} EGP`; }
}
