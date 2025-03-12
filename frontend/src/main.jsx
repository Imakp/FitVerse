// main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom"; // Changed from react-router to react-router-dom
import DashBoard from "./Pages/DashBoard.jsx";
import Rewards from "./Pages/Rewards.jsx";
import Activity from "./Pages/Activity.jsx";
import Challenges from "./Pages/Challenges.jsx";
import MyProfile from "./Pages/MyProfile.jsx";
import Login from "./components/Login";
import { FitnessDashboard } from "./components/FitnessDashboard";
import { ProtectedRoute } from "./components/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route path="dashboard" element={
        <ProtectedRoute>
          <FitnessDashboard />
          <DashBoard />
        </ProtectedRoute>
      } />
      <Route path="rewards" element={
        <ProtectedRoute>
          <Rewards />
        </ProtectedRoute>
      } />
      <Route path="activity" element={
        <ProtectedRoute>
          <Activity />
        </ProtectedRoute>
      } />
      <Route path="challenges" element={
        <ProtectedRoute>
          <Challenges />
        </ProtectedRoute>
      } />
      <Route path="my-profile" element={
        <ProtectedRoute>
          <MyProfile />
        </ProtectedRoute>
      } />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);