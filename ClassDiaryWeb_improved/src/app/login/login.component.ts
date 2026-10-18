import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Store} from "@ngrx/store";
import {MessageState} from "../_states/message.state";
import {setMessage} from "../_states/message.actions";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  role: string;
  reactiveForm: FormGroup;
  formStatus;
  isProcessing = false;

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  errorCode = null;
  showPassword: boolean = false;

  constructor(private authService: AuthService,
              private storageService: StorageService,
              private router: Router,
              private store: Store<{ message: MessageState}>) { }

  ngOnInit(): void {
    this.reactiveForm = new FormGroup({
      username : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required]),
    })
  }

  onSubmit(): void {

    this.isProcessing = true;
    this.authService.login(this.reactiveForm.get('username')?.value,
      this.reactiveForm.get('password')?.value).subscribe({
      next: res => {
        this.storageService.makeLogin(res.token);
        const successMessage = `Bejelentkezve, mint: \n${this.reactiveForm.get('username')?.value}`
        this.isProcessing = false;
        this.isLoginFailed = false;
        this.isLoggedIn = true;

        if(res.token === 'DEMO_TOKEN'){
          this.storageService.demo_login = true
        }

        this.authService.get().subscribe({
          next: (user) => {
            this.storageService.saveUser(user);
            console.log(this.storageService.isLoggedIn());
            //this.storageService.setMessage(successMessage); - set Message from internal service
            this.store.dispatch(setMessage({messageText: successMessage})); //Set message through NgRX-action
            this.router.navigate(['home']);
            this.storageService.demo_login = false;
          },
          error: (err: HttpErrorResponse) => {
            console.log(err.error.message);
          }
        })
      },
      error: (err: HttpErrorResponse) => {
        this.errorCode = err.status;
        this.errorMessage = (this.errorCode === 500 || this.errorCode === 0) ? 'Szerver hiba!' : err.error;
        this.isProcessing = false;

        this.isLoginFailed = true;
        console.log(err);
      }
    });
  }
}
