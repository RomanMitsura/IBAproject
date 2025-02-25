import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import SkeletonCard from "./SkeletonCard";
import axios from "../axios";

export default function SideAllVideos({ userId, videoId }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/videos/user/${userId}`, {
        params: { sortBy: "views" },
      });
      setVideos(response.data.videos);
    } catch (err) {
      setError("Ошибка загрузки видео.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [userId]);

  const loadMoreVideos = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const otherVideos = videos.filter((video) => video._id !== videoId);
  const limitedVideos = otherVideos.slice(0, page * limit);
  const allVideosLoaded = limitedVideos.length >= otherVideos.length;

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 p-4">
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && videos.length === 0 && (
          <p className="text-gray-500 text-center">
            Нет видео для отображения.
          </p>
        )}
        {!loading && videos.length > 0 && otherVideos.length === 0 && (
          <p className="text-light-second-text text-center">
            Нет других видео пользователя.
          </p>
        )}
        {!loading &&
          limitedVideos.map((video) => (
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

      {!loading && otherVideos.length > 0 && !allVideosLoaded && (
        <div className="flex justify-center mt-6">
          <button
            onClick={loadMoreVideos}
            className="px-4 py-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
          >
            Показать ещё
          </button>
        </div>
      )}
    </div>
  );
}
