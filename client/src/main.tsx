import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "@fontsource/im-fell-great-primer-sc";

import App from "./App";
import GamePage from "./components/Game/GamePage.tsx";
import MainPage from "./components/Home/MainPage.tsx";
import ProfilePage from "./components/Home/ProfilePage.tsx";
import NotFound from "./components/NotFound.tsx";
import { UserProvider } from "./components/Utils/UserContext.tsx";

import "./style.css";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<NotFound />} element={<App />}>
      <Route path="/" element={<MainPage />} />
      <Route path="/game" element={<GamePage />} />
      <Route path="/profile" element={<ProfilePage />} />
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
