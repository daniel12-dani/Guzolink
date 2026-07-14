import { useAuth } from "../auth.context.js";
import { Link } from "react-router-dom";

function ProfileCard() {
  const { user } = useAuth();

  // Guard clause against initial null auth state
  if (!user) return null;

  const profileImage = user.profilePicture || "https://picsum.photos/300/300";

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl border border-slate-700/50 bg-slate-800/60 backdrop-blur-md text-slate-100 p-6 shadow-xl mb-8">
      {/* Header Profile Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-700/50">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-amber-500/30 p-1 bg-slate-900 shrink-0">
          <img
            src={profileImage}
            alt={`${user.username || "User"}'s profile`}
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="text-center sm:text-left flex-1 space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Welcome {user.username}
          </h2>
        </div>
      </div>

      {/* User Technical Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-sm">
        <div className="space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Email Address
          </span>
          <span className="text-slate-200 break-all font-medium">
            {user.email}
          </span>
        </div>

        <div className="space-y-1 bg-slate-900/40 p-3 rounded-xl border border-slate-700/30">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            Phone Number
          </span>
          <span className="text-slate-200 font-medium">
            {user.phone || "Not provided"}
          </span>
        </div>
        <div>
          <p className="text-sm tracking-tight text-gray-500 mb-2">
            You can update your info with this button
          </p>
          <Link
            to={`/update/${user.id || user._id}`}
            className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-md hover:bg-amber-400 active:scale-[0.98] transition-all duration-200"
          >
            Update Profile
          </Link>
        </div>
      </div>

      {/* Financial Section Placeholder Slot */}
      {/* <div className="mt-4 pt-4 border-t border-slate-700/30">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Financial Overview</h3>
        ... financial widgets go here
      </div> 
      */}
    </div>
  );
}

export default ProfileCard;
