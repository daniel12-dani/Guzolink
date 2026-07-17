import { useAuth } from "../auth.context.js";
import { useNavigate } from "react-router-dom";
// good dashboard that can contain , the user info, the shops and the summary of analysis, current finances.

import ProfileCard from "../pages/Profile.jsx";
import MyShops from "../../shop/pages/MyShopsPage.jsx";
import { Link } from "react-router-dom";

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

    return (
      // the top section of the dashboard contains, user name, profile picture and button to goto my profile page
      <div className="mx-auto p-2 sm:px-2 lg:px-2">
        <div className="flex flex-col items-center justify-between mb-8 rounded-3xl border border-white/10 bg-slate-800 p-2 shadow-sm">
          <ProfileCard user={user} />
        </div>

        <div className="mb-8 rounded-3xl border border-white/10 bg-slate-800 p-8 shadow-sm">
          <Link
            to={"/"}
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white transition mb-2 mt-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to home
          </Link>

          {/* shops */}
          <Link to="/shops">
            <h2 className="text-2xl font-bold text-center border border-slate-600 rounded-2xl text-white mb-2 p-2">
              My Shops
            </h2>
          </Link>
          <MyShops />
        </div>
      </div>
    );
  };

export default Dashboard;
