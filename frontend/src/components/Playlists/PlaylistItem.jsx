import { Link } from "react-router-dom";
import PlaylistForm from "./PlaylistForm";
import PlaylistVideo from "./PlaylistVideo";

export default function PlaylistItem({
  playlist,
  isOwnProfile,
  editPlaylist,
  setEditPlaylist,
  openPlaylists,
  togglePlaylist,
  handleUpdate,
  handleDelete,
  handleRemoveVideo,
}) {
  return (
    <div className="border-b border-light-second-text p-4 rounded-t-lg">
      {editPlaylist?._id === playlist._id ? (
        <PlaylistForm
          playlist={editPlaylist}
          setPlaylist={setEditPlaylist}
          onSubmit={handleUpdate}
          isEdit={true}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => togglePlaylist(playlist._id)}
                className="px-2 py-1 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className={`size-6 transition-transform duration-200 ${openPlaylists[playlist._id] ? "rotate-180" : ""}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="text-xl font-bold hover:underline"
                onClick={() => togglePlaylist(playlist._id)}
              >
                {playlist.title || "Без названия"}
              </button>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => setEditPlaylist(playlist)}
                  className="px-2 py-1 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDelete(playlist._id)}
                  className="px-2 py-1 bg-red-700 hover:bg-red-500 rounded-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    className="size-6 stroke-red-200"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <p className="text-light-second-text mb-2 truncate">
            {playlist.description || "Без описания"}
          </p>
          {openPlaylists[playlist._id] && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {playlist.videos && playlist.videos.length > 0 ? (
                playlist.videos.map((video) => (
                  <PlaylistVideo
                    key={video._id || video}
                    video={video}
                    playlistId={playlist._id}
                    isOwnProfile={isOwnProfile}
                    onRemoveVideo={handleRemoveVideo}
                  />
                ))
              ) : (
                <p className="text-light-second-text col-span-full text-center">
                  В плейлисте нет видео
                </p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
