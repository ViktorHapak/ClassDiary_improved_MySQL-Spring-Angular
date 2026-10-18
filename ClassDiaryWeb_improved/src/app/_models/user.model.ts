export class User {


  constructor(id: any, firstname: string, lastname: string, email: string, username: string, birth: Date, password: string, userrole: string, sclass: string, children: string[], teacherRegistries: string[]) {
    this.id = id;
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.username = username;
    this.birth = birth;
    this.password = password;
    this.userrole = userrole;
    this.sclass = sclass;
    this.children = children;
    this.teacherRegistries = teacherRegistries;
  }

  id?: any;
  firstname?: string;
  lastname?: string;
  email?: string;
  username?: string;
  birth?: Date;
  password?: string;
  userrole?: string;
  sclass?: string;
  children?: string[];
  teacherRegistries?: string[];
}
