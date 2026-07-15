import DashboardUI from "../components/DashboardUI.jsx";
import { useAuth } from "../auth.context.js";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  if (isAuthLoading) {
    return <p className="p-6 text-white">Checking your session…</p>;
  }
  if (!user) {
    <p className="p-6 text-white">Please login in to view dashboard…</p>;
    navigate("/login");
  }

  if (!user)
    return <p className="p-6 text-white">Loading profile configuration…</p>;
  
  return <DashboardUI user={user} />;
}

export default Dashboard;
