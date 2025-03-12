import { useState } from "react";
import Navbar from "./Components/Navbar";
import { Outlet } from "react-router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import { FitnessDashboard } from "./components/FitnessDashboard";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Client ID loaded:", GOOGLE_CLIENT_ID);

function App() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
    <GoogleOAuthProvider
      clientId={GOOGLE_CLIENT_ID}
      onScriptLoadError={() => console.error("Google Script failed to load")}
    >
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Login />
          <FitnessDashboard />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
