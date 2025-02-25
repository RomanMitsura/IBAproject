import { Link } from "react-router-dom";

export default function ProfileHeader({
  profileUser,
  isOwnProfile,
  isAdmin,
  onLogout,
  onDelete,
}) {
  return (
    <div className="relative pt-15">
      <Link to="/" className="absolute sm:top-0 sm:left-0 left-0 top-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </Link>

      {(isOwnProfile || isAdmin) && (
        <div className="absolute top-0 right-0 flex gap-2">
          {(isOwnProfile || isAdmin) && (
            <button
              onClick={onDelete}
              className="px-2 py-1 rounded-md bg-red-700 hover:bg-red-500 text-white"
            >
              Удалить профиль
            </button>
          )}
          {isOwnProfile && (
            <button
              onClick={onLogout}
              className="px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
            >
              Выйти
            </button>
          )}
        </div>
      )}

      <div className="flex items-center justify-center gap-4">
        <img
          className="h-40 w-40 rounded-full object-cover"
          src={profileUser.avatarUrl}
          alt={`${profileUser.fullname}'s avatar`}
          onError={(e) => {
            e.target.src =
              "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";
          }}
        />
        <div className="flex flex-col gap-2">
          <p className="font-bold text-2xl">{profileUser.fullname}</p>
          {isOwnProfile && (
            <Link
              to="edit-profile"
              className="px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
            >
              Редактировать профиль
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
