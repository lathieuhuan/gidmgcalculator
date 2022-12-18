import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import "./assets/css/tailwind.css";
import "./assets/css/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
