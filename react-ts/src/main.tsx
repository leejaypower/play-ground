import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Mirror2 from "./Modal.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Mirror2 />
  </StrictMode>
);
