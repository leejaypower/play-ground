import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Filter3 from "./Filter3";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Filter3 />
  </StrictMode>
);
