import { createBrowserRouter } from "react-router-dom";
import { Root } from "./components/Root";
import { EventPage, loader as EventLoader } from "./pages/EventPage";
import { EventsPage, loader as EventListLoader } from "./pages/EventsPage";
import {
  CreateEventPage,
  loader as CreateEventLoader,
} from "./pages/CreateEventPage";
import { NotFound } from "./components/NotFound";
import { ErrorPage } from "./components/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <EventsPage />,
        loader: EventListLoader,
      },
      {
        path: "/event/:eventId",
        element: <EventPage />,
        loader: EventLoader,
      },
      {
        path: "/new",
        element: <CreateEventPage />,
        loader: CreateEventLoader,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
