// notification.route.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router";

const NotificationPage = lazy(() => import("./NotificationPage"));

export const notificationRoutes: RouteObject[] = [
  {
    path: "/notifications",
    element: <NotificationPage />,
  },
];
