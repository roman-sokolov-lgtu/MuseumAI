import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import ProtectedLayout from "./pages/ProtectedLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Exhibits from "./pages/Exhibits";
import Dialogs from "./pages/Dialogs";
import Analytics from "./pages/Analytics";

export const router = createBrowserRouter([
  { path: "/login", Component: Login },
  {
    path: "/",
    element: <ProtectedLayout />,
    children: [
      {
        element: <Root />,
        children: [
          { index: true, Component: Analytics },
          { path: "exhibits", Component: Exhibits },
          { path: "dialogs", Component: Dialogs },
          { path: "analytics", Component: Analytics },
        ],
      },
    ],
  },
]);
