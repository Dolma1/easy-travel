import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./app/store";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Login, Register, Activate, Dashboard, Journal } from "./components";
import { Provider } from "react-redux";

import { HomePage, About } from "./pages";
import AuthLayout from "./routes/AuthLayout";
import JournalDetail from "./components/DashBoard/Journal/JournalDetail";
import EditJournal from "./components/DashBoard/Journal/Edit-Journal";

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
        path: "/about",
        element: <About />,
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
        path: "/journal/:id",
        element: (
          <AuthLayout authentication={true}>
            <JournalDetail  />
          </AuthLayout>
        ),
      },
      {
        path: "/journal/edit/:id",
        element: (
          <AuthLayout authentication={true}>
            <EditJournal  />
          </AuthLayout>
        ),
      },


      // <Link 
      //         to={`/journal/edit/${journal._id}`}
      //         className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
      //       ></Link>
      //TODO:NARESH Implement this Page {
      //   path: "/register-success",
      //   element: (
      //     <AuthLayout authentication={false}>
      //       <RegistrationSuccessPage />
      //     </AuthLayout>
      //   ),
      // },
      {
        path: "/dashboard",
        element: (
          <AuthLayout authentication={true}>
            <Dashboard />
          </AuthLayout>
        ),
      },













      // TODO: THis should be a journal Page where the User will see his journals based in pages directory...
      // TODO: The sidebar of the DASHBOARD should be a seperate component making it reusable
      // TODO: LOGOUT BUTTON SHOULD BE its seperate component that can be placed inside the DASHBOARD OR HEADER FOLDER INSIDE COMPONENTS
      // TODO: Dashboard Should not be inside the Header directory it should be standalone directory inside COMPONENTS FOLDER
      // TODO: NAVIGATION MENU SHOULD WORK PROPERLY DIRECTING TO THE SAME PAGE BUT THE ABOUT SECTION OF THE HOME PAGE
      // TODO: THERE IS Seperate folder header and nav as of now Make it one. Utilize the header as a navigation bar NO need of navigation file...
      // TODO: IMPROVE THE UI OF THE DASHBOARD SIDEBAR, LANDING PAGE LOGIN PAGE, REGISTER PAGE ETC.
      {
        path: "/journal",
        element: (
          <AuthLayout authentication={true}>
            <Journal />
          </AuthLayout>
        ),
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
