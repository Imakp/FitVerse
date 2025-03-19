// todo: frontend integration and remove hardcoded values
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
import Leaderboard from "./Components/Leaderboard.jsx";
import Wallet from "./Pages/Wallet.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Login />} />
      <Route
        path="dashboard"
        element={
          <>
            <DashBoard />
          </>
        }
      />

      {/* todo: protected route on rewards, activity, challenges, wallet until and unless
      google fit not connected */}

      <Route path="rewards" element={<Rewards />} />
      <Route path="activity" element={<Activity />} />
      <Route path="challenges" element={<Challenges />} />
      <Route path="my-profile" element={<MyProfile />} />
      <Route path="wallet" element={<Wallet />} />
      <Route path="leaderboard" element={<Leaderboard />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
