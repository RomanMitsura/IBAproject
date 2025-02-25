import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import store from "./redux/store.js";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <div className="text-[#0f0f0f] dark:text-white max-w-[1920px] mx-auto py-4 px-6">
      <App />
    </div>
  </Provider>
);
