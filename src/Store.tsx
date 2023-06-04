import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authApi } from "./Login/authStore";
import { duckApi } from "./Ducks/duckStore";
import { memberApi } from "./Members/memberStore";
import { affiliateApi } from "./Affiliates/affiliateStore";
import { eventApi } from "./Events/eventsStore";

const reducer = combineReducers({
  [authApi.reducerPath]: authApi.reducer,
  [duckApi.reducerPath]: duckApi.reducer,
  [memberApi.reducerPath]: memberApi.reducer,
  [affiliateApi.reducerPath]: affiliateApi.reducer,
  [eventApi.reducerPath]: eventApi.reducer,
});
const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(duckApi.middleware)
      .concat(memberApi.middleware)
      .concat(affiliateApi.middleware)
      .concat(eventApi.middleware),
});

export default store;
