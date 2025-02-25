import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { Link } from "react-router-dom";

export default function VideoCard({
  videoTitle,
  videoImageUrl,
  videoUserName,
  videoUserAvatar,
  videoViews,
  videoData,
  userId,
}) {
  const formatViews = (views) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views || 0;
  };

  const formattedDateRaw = formatDistanceToNow(new Date(videoData), {
    addSuffix: true,
    locale: ru,
  });
  const formattedDate = formattedDateRaw.replace("около ", "");

  const formattedViews = formatViews(videoViews);

  // Обрезаем title до 20 символов с многоточием
  const truncatedTitle =
    videoTitle.length > 33 ? videoTitle.slice(0, 33) + "..." : videoTitle;

  return (
    <div className="w-full group transition-all duration-300 rounded-2xl hover:shadow-xl dark:shadow-white/15">
      <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg">
        <img
          src={videoImageUrl}
          alt={videoTitle}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105 group-hover:brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
          <span className="text-white font-bold text-sm truncate">
            {truncatedTitle}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-2 px-2 py-1">
        <Link to={`/profile/${userId}`} className="shrink-0">
          <img
            src={videoUserAvatar}
            alt={`${videoUserName}'s avatar`}
            className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:rotate-6"
            onError={(e) => {
              console.error("Ошибка загрузки аватара:", videoUserAvatar);
              e.target.src =
                "https://i.pinimg.com/736x/4c/85/31/4c8531dbc05c77cb7a5893297977ac89.jpg";
            }}
          />
        </Link>

        <div className="flex flex-col justify-between flex-grow">
          <div className="break-words font-bold">{truncatedTitle}</div>{" "}
          <div className="text-sm text-light-second-text">{videoUserName}</div>
          <div className="text-sm text-light-second-text flex items-center gap-1">
            {formattedViews}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span className="font-black">·</span>
            {formattedDate}
          </div>
        </div>
      </div>
    </div>
  );
}
