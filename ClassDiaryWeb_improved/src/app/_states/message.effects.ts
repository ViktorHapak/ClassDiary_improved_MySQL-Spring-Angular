// message.effects.ts

import {inject, Injectable} from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {map, switchMap, tap, timer} from 'rxjs';
import { closeMessage, setMessage } from './message.actions';

export const messageEffect = createEffect(
  (actions$ = inject(Actions)) =>
  {
    return actions$.pipe(
      ofType(setMessage),
      switchMap(() => {
        return timer(4000).pipe(
          map(() => closeMessage())
        );
      })
    );
  },
  { functional: true }
);

export const closeEffect = createEffect(
  (actions$ = inject(Actions)) =>
  {
    return actions$.pipe(
      ofType(closeMessage),
      tap(() => window.location.reload())
    );
  },
  { functional: true, dispatch: false }
);

