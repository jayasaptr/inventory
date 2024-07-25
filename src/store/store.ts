import { combineReducers, legacy_createStore } from "redux";
import { userReducer } from "./user";

export const reducer = combineReducers({
  user: userReducer,
});

export const globalStore = legacy_createStore(reducer);
