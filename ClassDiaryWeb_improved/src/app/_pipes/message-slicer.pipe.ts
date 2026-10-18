import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'messageSlicer'
})
export class MessageSlicerPipe implements PipeTransform {

  transform(value: string | null): string {

    if (!value) return "Szerver hiba!";
    else  if (value.length > 50) return "Szerver hiba!";
    else return value.substr(0, 50);

    return null;
  }

}
