import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  Login,
  Register,
  Activate,
  PageNotFound,
  Settlement,
} from "./components";
import { Provider } from "react-redux";

import {
  HomePage,
  DashBoardPage,
  EditJournalPage,
  SingleJournalPage,
  Profile,
  GroupPage,
  JournalsPage,
  SingleGroupPage,
} from "./pages";
import AuthLayout from "./routes/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },

      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        ),
      },

      {
        path: "/activate",
        element: (
          <AuthLayout authentication={false}>
            <Activate />
          </AuthLayout>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <Register />
          </AuthLayout>
        ),
      },

      {
        path: "/profile",
        element: (
          <AuthLayout authentication={true}>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <DashBoardPage />
          </AuthLayout>
        ),
      },

      {
        path: "/groups",
        element: (
          <AuthLayout authentication={true}>
            <GroupPage />
          </AuthLayout>
        ),
      },
      {
        path: "/groups/:id",
        element: (
          <AuthLayout authentication={true}>
            <SingleGroupPage />
          </AuthLayout>
        ),
      },
      {
        path: "/groups/settlement/:expenseId",
        element: (
          <AuthLayout authentication={true}>
            <Settlement />
          </AuthLayout>
        ),
      },

      {
        path: "/journal",
        element: (
          <AuthLayout authentication={true}>
            <JournalsPage />
          </AuthLayout>
        ),
      },

      {
        path: "/journal/:id",
        element: (
          <AuthLayout authentication={true}>
            <SingleJournalPage />
          </AuthLayout>
        ),
      },
      {
        path: "/journal/edit/:id",
        element: (
          <AuthLayout authentication={true}>
            <EditJournalPage />
          </AuthLayout>
        ),
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
);
