export default function PlaylistSelector({ user, playlists, onAddToPlaylist }) {
  return user ? (
    <select
      onChange={(e) => onAddToPlaylist(e.target.value)}
      className="px-2 py-2 mb-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md text-sm transition-all duration-200"
      defaultValue=""
    >
      <option value="" disabled>
        Добавить в плейлист
      </option>
      {playlists.map((playlist) => (
        <option key={playlist._id} value={playlist._id}>
          {playlist.title}
        </option>
      ))}
    </select>
  ) : null;
}
