import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router";
import DashBoard from "./Pages/DashBoard.jsx";
import Rewards from "./Pages/Rewards.jsx";
import Activity from "./Pages/Activity.jsx";
import Challenges from "./Pages/Challenges.jsx";
import MyProfile from "./Pages/MyProfile.jsx";

const router = createBrowserRouter(
  createRoutesFromElements([
    <Route path="/" element={<App />}>
      <Route path="dashboard" element={<DashBoard />} />
      <Route path="rewards" element={<Rewards />} />
      <Route path="activity" element={<Activity />} />
      <Route path="challenges" element={<Challenges />} />
      <Route path="my-profile" element={<MyProfile />} />
    </Route>,
  ])
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
