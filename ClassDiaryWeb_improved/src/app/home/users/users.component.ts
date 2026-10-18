import {Component, OnInit} from '@angular/core';
import {Student} from "../../_models/student.model";
import {User} from "../../_models/user.model";
import {StudentService} from "../../_services/student.service";
import {UserService} from "../../_services/user.service";
import {StorageService} from "../../_services/storage.service";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {MessageState} from "../../_states/message.state";
import {setMessage} from "../../_states/message.actions";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit{

  roleNames : string[] = ["ROLE_Visitor", "ROLE_Parent", "ROLE_Teacher", "ROLE_ClassHead", "ROLE_Admin","all"];
  currentRoleName: string = "all";

  users: User[] = [];
  currentUser: User = {};
  currentIndex = -1;
  emptyUser: User = {};
  name = '';

  messageText = '';
  messageMode = false
  crudOperation:string = "add";
  crudMode = false

  page = 1;
  count = 0;
  size = 5;

  constructor(private userService: UserService,
              protected storageService: StorageService,
              protected router: Router,
              private store: Store<{ message: MessageState}>) {
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.emptyUser.id = -1;

    console.log(this.storageService.getUser())
  }


  protected getAllUsers() {
    let params =
      {'roleName': this.currentRoleName,'title':this.name, 'page': this.page-1, 'size': this.size};

    this.userService.getAllByPage(params).subscribe({
      next: (data) => {
        const { users, totalItems }: any = data;
        this.users = users;
        this.count = totalItems;
        this.storageService.writeCountValue(this.count);
        console.log(users, totalItems);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  handlePageChange(event: number) {
    this.page = event;
    this.getAllUsers()

  }

  handleSizeChange(event: number) {
    this.size = event;
    this.getAllUsers()
  }

  refreshList(): void {
    this.getAllUsers()
    this.currentUser = {};
    this.currentIndex = -1;
  }

  removeUser(user: User) {
    const loggedInUser = this.storageService.getUser();

    if(loggedInUser && user.username !== loggedInUser.username){
      this.userService.delete(user.id).subscribe({
      next: (data) => {
        console.log(data)
        this.refreshList()
      }, error: (err) => {

      }
    })}

  }

  callInfo(user: User) {

    this.userService.get(user.id).subscribe({
      next: (data) => {
        console.log(data)
        this.currentUser = data
        this.currentIndex = data.id
        console.log(data.firstname)
      }, error: (err) => {

      }
    })

  }

  searchByName() {
    this.page=1
    this.getAllUsers();

  }

  searchByRole() {
    this.page=1
    this.getAllUsers();
  }

  openForm(operation: string, user: User) {
    this.currentIndex = user.id;
    this.currentUser = user;
    this.crudOperation = operation;
    console.log(this.currentUser)
    console.log(this.currentIndex)
    this.crudMode = true;
    console.log(this.crudMode)
  }

  setMessage(message: string): void {
    this.crudMode = false;
    this.store.dispatch(setMessage({messageText: message}))
  }

  teacherAccess(){
    if (this.storageService.hasTeacherRole() || this.storageService.hasAdminRole()) return true
    else return false;
  }

  adminAccess() {
    if (this.storageService.hasAdminRole()) return true
    else return false;
  }

  anonymAccess() {
    if (this.storageService.isDemoMode()) return true;
    else return false;
  }

  isOwnUser(_username: string): boolean {
    return (_username === this.storageService.getUser().username ||
      (this.storageService.isDemoMode() && _username === 'anonymous'))
  }

  protected async confirmMessage(): Promise<void>{
    this.messageMode = false;
    this.messageText = '';
    window.location.reload();
  }
}
