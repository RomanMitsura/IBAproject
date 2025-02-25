import { Link } from "react-router-dom";
import VideoCard from "./VideoCard";
import { useSelector } from "react-redux";
import SkeletonCard from "./SkeletonCard";

export default function AllVideos() {
  const { videos = { items: [], status: "loading" } } = useSelector(
    (state) => state.videos || {}
  );

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 ">
        {videos.status === "loading" &&
          Array.from({ length: 15 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        {videos.status === "error" && <p>Error loading videos.</p>}
        {videos.status === "loaded" &&
          videos.items.map((video) => (
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
    </>
  );
}
