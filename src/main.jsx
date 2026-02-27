import React from "react";
import ReactDOM from "react-dom/client";
import AuthContextProvider from "./context/AuthContext";
import App from "./App";
import { BrowserRouter } from "react-router-dom";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>
);
