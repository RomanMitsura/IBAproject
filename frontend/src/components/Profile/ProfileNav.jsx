import { NavLink } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";

export default function ProfileNav({ isOwnProfile, isAdmin }) {
  return (
    <nav className="flex gap-2 pb-0.3 my-5">
      <NavLink
        to="user-videos"
        className={({ isActive }) =>
          `p-2 ${
            isActive
              ? "text-black border-b-2 border-black dark:text-white dark:border-white"
              : "text-light-second-text hover:border-b-2 hover:border-light-second-text dark:hover:border-light-second-text"
          }`
        }
      >
        Видео
      </NavLink>
      <NavLink
        to={isOwnProfile ? "user-playlists" : "public-playlists"}
        className={({ isActive }) =>
          `p-2 ${
            isActive
              ? "text-black border-b-2 border-black dark:text-white dark:border-white"
              : "text-light-second-text hover:border-b-2 hover:border-light-second-text dark:hover:border-light-second-text"
          }`
        }
      >
        Плейлисты
      </NavLink>
      {isOwnProfile && <ProfileDropdown isAdmin={isAdmin} />}
    </nav>
  );
}
