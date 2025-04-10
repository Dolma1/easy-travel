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

  TermsOfService,
  PrivacyPolicy1,
  Support,
  AdminDashboard,
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
  ExploreJournalPage,
} from "./pages";
import AuthLayout from "./routes/AuthLayout";
import AdminLayout from "./routes/AdminLayout";
import AdminPage from "./pages/AdminPage";
import AdminDashboardPage from "./pages/AdminPage";

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
        path: "/terms",
        element: (
          <AuthLayout authentication={false}>
            <TermsOfService />
          </AuthLayout>
        ),
      },
      {
        path: "/privacy",
        element: (
          <AuthLayout authentication={false}>
            <PrivacyPolicy1 />
          </AuthLayout>
        ),
      },
      {
        path: "/support",
        element: (
          <AuthLayout authentication={false}>
            <Support />
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
        path: "/explore",
        element: (
          <AuthLayout authentication={true}>
            <ExploreJournalPage />
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

  //Admin
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      {
        index: true,
        element: (
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        ),
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </StrictMode>
);
