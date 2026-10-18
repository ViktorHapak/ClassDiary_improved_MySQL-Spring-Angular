import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rolename'
})
export class RolenamePipe implements PipeTransform {

  transform(value: string): string {
    let roleNames : string[] = ["ROLE_Visitor", "ROLE_Parent", "ROLE_Teacher", "ROLE_ClassHead", "ROLE_Admin","all"];

    switch (value){case (roleNames[0]): return "Látogató";
      case (roleNames[1]): return "Szülő";
      case (roleNames[2]): return "Tanár";
      case (roleNames[3]): return "Osztályfőnök";
      case (roleNames[4]): return "Adminisztrátor";
      case (roleNames[5]): return "Összes";
      default: return "Anonymous";}
  }

}
