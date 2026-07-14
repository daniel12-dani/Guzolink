import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import AppProviders from "./providers/AppProviders.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter basename="/guzolink">
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>,
);
