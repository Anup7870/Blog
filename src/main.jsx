import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { store, persistStor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import ThemeProvider from "./components/ThemeProvider.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
   <PersistGate persistor={persistStor}>
      <Provider store={store}>
         <ThemeProvider>
            <App />
         </ThemeProvider>
      </Provider>
   </PersistGate>
);
