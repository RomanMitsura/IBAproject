import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export default function PlaylistCard({
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

  const formattedDateRaw =
    videoData && !isNaN(new Date(videoData))
      ? formatDistanceToNow(new Date(videoData), {
          addSuffix: true,
          locale: ru,
        })
      : "Дата неизвестна";
  const formattedDate = formattedDateRaw.replace("около ", "");

  const formattedViews = formatViews(videoViews);

  return (
    <div className="w-full group transition-all duration-300 rounded-2xl hover:shadow-xl dark:shadow-white/15">
      <div className="relative w-full pb-[56.25%] overflow-hidden rounded-lg bg-gray-200">
        {videoImageUrl && (
          <img
            src={videoImageUrl}
            alt={videoTitle || "Без названия"}
            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:brightness-75"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2">
          <span className="text-white font-bold text-sm truncate">
            {videoTitle || "Без названия"}
          </span>
        </div>
      </div>
      <div className="flex gap-2 mt-2 px-2 py-1">
        <div className="shrink-0">
          {videoUserAvatar ? (
            <img
              src={videoUserAvatar}
              alt={`${videoUserName || "Неизвестный пользователь"}'s avatar`}
              className="w-12 h-12 rounded-full object-cover transition-transform duration-300 group-hover:rotate-6"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 transition-transform duration-300 group-hover:rotate-6"></div>
          )}
        </div>
        <div className="flex flex-col justify-between flex-grow">
          <div className="break-words font-bold truncate-text transition-colors duration-300 ">
            {videoTitle || "Без названия"}
          </div>
          <div className="text-sm text-light-second-text">
            {videoUserName || "Неизвестный пользователь"}
          </div>
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
