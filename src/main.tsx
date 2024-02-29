import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import App from "./App";
import { DynamicStoreProvider } from "./features";

import "./assets/css/tailwind.css";
import "./assets/css/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <DynamicStoreProvider>
    {({ store, persistor }) => (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    )}
  </DynamicStoreProvider>
);
