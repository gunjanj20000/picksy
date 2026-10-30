import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { registerSW } from "virtual:pwa-register";

// Register Service Worker for 100% offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log("Qapp: New content available, reloading...");
  },
  onOfflineReady() {
    console.log("Qapp: App is ready for 100% offline operation!");
  },
});

createRoot(document.getElementById("root")!).render(<App />);
