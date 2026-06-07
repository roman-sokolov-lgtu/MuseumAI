import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { QRScanner } from "./pages/QRScanner";
import { ChatSession } from "./pages/ChatSession";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/scanner",
    Component: QRScanner,
  },
  {
    path: "/session/:exhibitId",
    Component: ChatSession,
  },
]);
