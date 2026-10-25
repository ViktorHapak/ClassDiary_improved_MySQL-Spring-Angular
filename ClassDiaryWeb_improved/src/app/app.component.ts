import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth.service';
import { EventBusService } from './_shared/event-bus.service';
import {TeacherService} from "./_services/teacher.service";

import {Store} from "@ngrx/store";
import {MessageState} from './_states/message.state';
import {closeMessage} from './_states/message.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,AfterViewInit,OnDestroy {
  isLoggedIn;
  username?: string;
  role?: string;

  messageMode: boolean = false;
  messageText: string = "";
  messageSubscription: Subscription | null = null;

  isRightMenuOpen: boolean = false;
  eventBusSub?: Subscription;

  @ViewChild('rightMenu') rightMenu!: ElementRef;

  constructor(
    protected storageService: StorageService,
    private teacherService: TeacherService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private store: Store<{ message: MessageState}>,
  ) {}

  ngOnInit(): void {
    this.defineSchoolYear();
    if (this.storageService.isLoggedIn()) {
      const user = this.storageService.getUser();
      this.username = user?.username;
      this.role = user?.role.toString();
      this.isLoggedIn = true;
    }

    this.eventBusSub = this.eventBusService.on('logout', () => {
      this.logout();
    });

    this.messageSubscription = this.store.select('message').subscribe((data: MessageState) => {
      this.messageMode = data.messageMode;
      this.messageText = data.messageText;
    })

  }

  ngAfterViewInit(): void {
    // Check if the user just registered
  }

  defineSchoolYear(){
    this.teacherService.getSchoolYear().subscribe({
      next: (data) => {
        console.log(data.schoolYear);
        this.storageService.saveSchoolYear(data.schoolYear);
      }, error: (err) => {
        console.log(err.error);
    }
    })
  }

  closeMessage(): void{
    this.store.dispatch(closeMessage());
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.storageService.clean();
        this.storageService.count = -1;
        window.location.reload();
      }, error: (err) => {
        console.log(err.error);
      }

    })
  }

  ngOnDestroy(): void {
    if (this.messageSubscription){
      this.messageSubscription.unsubscribe();
    }
  }

  @HostListener('document:click', ['$event'])
  exitMenu(event: MouseEvent): void {
    if (!this.isRightMenuOpen) return;

    const target = event.target as Node;

    if (!this.rightMenu.nativeElement.contains(target)) {
      this.isRightMenuOpen = false;
    }
  }
}
