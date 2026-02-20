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
import MainPage from "./components/MainPage.tsx";
import GamePage from "./components/GamePage.tsx";
import NotFound from "./components/NotFound.tsx";
import "@fontsource/im-fell-great-primer-sc"; // Loads the regular (400) font
import "@fontsource/im-fell-great-primer"; // regular
import "@fontsource/im-fell-great-primer/400-italic.css"; // italic

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
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>,
);
