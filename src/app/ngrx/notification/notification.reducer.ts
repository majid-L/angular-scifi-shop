import { createReducer, on } from '@ngrx/store';
import { showDialog, hideDialog, httpError, notify } from "./notification.actions";

export const initialState: NotificationState = {
  showDialog: false,
  data: null
};

export const notificationReducer = createReducer(
  initialState,
  on(showDialog, state => ({...state, showDialog: true})),
  on(hideDialog, state => ({...state, showDialog: false})),
  on(httpError, (state, { error }) => {
    return {
      showDialog: true,
      data: {
        title: "There was an error.",
        error
      }
    }
  }),
  on(notify, (state, { title, content }) => {
    return {
      showDialog: true,
      data: {
        title,
        content
      }
    }
  })
);