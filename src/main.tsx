import { createRoot } from "react-dom/client";
import "./index.css";
import Providers from "./context/Providers";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <Providers>
    <App />
  </Providers>
);
