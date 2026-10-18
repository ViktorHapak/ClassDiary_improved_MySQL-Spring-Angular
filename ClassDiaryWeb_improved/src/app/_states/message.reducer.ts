import {createReducer, on} from "@ngrx/store";
import {initialMessageState} from "./message.state";
import {closeMessage, setMessage} from "./message.actions";
import {state} from "@angular/animations";

let messageText;
export const messageReducer = createReducer(
  initialMessageState,
  on(setMessage, (state, { messageText }) => ({
    ...state,
    messageMode: true,
    messageText: messageText
  })),

  on(closeMessage, state => ({
    ...state,
    messageMode: false,
    messageText: ''
  }))
);
