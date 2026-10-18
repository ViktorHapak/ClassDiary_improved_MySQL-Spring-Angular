import {createAction, props} from "@ngrx/store";
import {async} from "rxjs";

export const setMessage = createAction(
  'setMessage', props<{ messageText: string }>()
);
export const closeMessage = createAction('closeMessage');
