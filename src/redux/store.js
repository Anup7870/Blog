import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";
import themeReducer from "./theme/themeSlice.js";
// when we have more than more reducers
const rootReducer = combineReducers({
   user: userReducer,
   theme: themeReducer,
});

const persistConfig = {
   key: "root",
   storage,
   version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
   reducer: persistedReducer,
   middleware: (getDefaultMiddleware) => {
      // for error of redux toolkit
      return getDefaultMiddleware({ serializableCheck: false });
   },
});

export const persistStor = persistStore(store);
