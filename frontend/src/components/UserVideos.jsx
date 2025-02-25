import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import VideoCard from "./VideoCard";
import SkeletonCard from "./SkeletonCard";
import SortFilter from "./SortFilter";

export default function UserVideos() {
  const loaderVideos = useLoaderData();
  const location = useLocation();
  const navigate = useNavigate();

  const [videos, setVideos] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVideos(null);
    setTimeout(() => {
      setVideos(loaderVideos);
    }, 500);
  }, [loaderVideos]);

  const sortBy = new URLSearchParams(location.search).get("sortBy") || "new";

  const handleSort = (type) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sortBy", type);
    navigate(`${location.pathname}?${searchParams.toString()}`);
  };

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  return (
    <div>
      <SortFilter sortBy={sortBy} onSort={handleSort} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {!videos &&
          Array.from({ length: 10 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}

        {videos && videos.length === 0 && (
          <p className="text-center text-light-second-text col-span-full">
            У пользователя нет видео.
          </p>
        )}

        {videos &&
          videos.slice(0, visibleCount).map((video) => (
            <Link key={video._id} to={`/${video._id}`}>
              <VideoCard
                videoTitle={video.title}
                videoImageUrl={video.videoImageUrl}
                videoUserName={video.user.fullname}
                videoUserAvatar={video.user?.avatarUrl}
                videoViews={video.views}
                videoData={video.createdAt}
                userId={video.user._id}
              />
            </Link>
          ))}
      </div>

      {videos && visibleCount < videos.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
          >
            Показать ещё
          </button>
        </div>
      )}
    </div>
  );
}
