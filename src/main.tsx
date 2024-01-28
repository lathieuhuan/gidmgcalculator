import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { PersistControlProvider } from "./features";
import { StoreSnapshotProvider } from "./store";

import "./assets/css/tailwind.css";
import "./assets/css/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <PersistControlProvider>
    {({ store, persistor }) => (
      <StoreSnapshotProvider store={store}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </StoreSnapshotProvider>
    )}
  </PersistControlProvider>
);
