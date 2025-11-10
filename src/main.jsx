import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import App from "./App.jsx";
import { FAKE_USERS } from "./mockData";

if (!localStorage.getItem("Users")) {
  localStorage.setItem("Users", JSON.stringify(FAKE_USERS));
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
