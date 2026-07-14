// good dashboard that can contain , the user info, the shops and the summary of analysis, current finances.

import ProfileCard from "../pages/Profile.jsx";
import MyShops from "../../shop/pages/MyShops.jsx";

function DashboardUI({ user }) {
  return (
    // the top section of the dashboard contains, user name, profile picture and button to goto my profile page
    <div className="mx-auto p-2 sm:px-2 lg:px-2">
      <div className="flex flex-col items-center justify-between mb-8 rounded-3xl border border-white/10 bg-slate-800 p-2 shadow-sm">
        <ProfileCard user={user} />
      </div>

      <div className="mb-8 rounded-3xl border border-white/10 bg-slate-800 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-center border border-slate-500 rounded-2xl text-white mb-4">
          My Shops
        </h2>
        <MyShops />
      </div>
    </div>
  );
}

export default DashboardUI;
