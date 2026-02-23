import "./style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import MainPage from "./components/Home/MainPage.tsx";
import GamePage from "./components/Game/GamePage.tsx";
import NotFound from "./components/NotFound.tsx";
import "@fontsource/im-fell-great-primer-sc"; // Loads the regular (400) font
import "@fontsource/im-fell-great-primer"; // regular
import "@fontsource/im-fell-great-primer/400-italic.css"; // italic
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./components/Utils/UserContext.tsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/game" element={<GamePage />} />
    </Route>,
  ),
);

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <UserProvider>
        <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
