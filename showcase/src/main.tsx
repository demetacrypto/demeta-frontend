import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!, {
  onCaughtError: (error) => {
    window.dispatchEvent(new CustomEvent("demeta-react-caught-error", {
      detail: { message: error instanceof Error ? error.message : String(error) }
    }));
  }
}).render(
  <StrictMode>
    <App />
  </StrictMode>
);
