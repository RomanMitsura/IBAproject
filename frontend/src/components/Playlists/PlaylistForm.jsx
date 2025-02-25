export default function PlaylistForm({
  playlist,
  setPlaylist,
  onSubmit,
  isEdit,
}) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-2 items-center">
      <div className="flex flex-col group relative w-full sm:flex-1">
        <label
          htmlFor={`${isEdit ? "edit" : "new"}-playlist-title`}
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Название плейлиста
        </label>
        <input
          id={`${isEdit ? "edit" : "new"}-playlist-title`}
          type="text"
          placeholder="Введите название"
          value={playlist.title}
          onChange={(e) => setPlaylist({ ...playlist, title: e.target.value })}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400 w-full"
        />
      </div>
      <div className="flex flex-col group relative w-full sm:flex-1">
        <label
          htmlFor={`${isEdit ? "edit" : "new"}-playlist-description`}
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Описание
        </label>
        <input
          id={`${isEdit ? "edit" : "new"}-playlist-description`}
          type="text"
          placeholder="Введите описание"
          value={playlist.description}
          onChange={(e) =>
            setPlaylist({ ...playlist, description: e.target.value })
          }
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400 w-full"
        />
      </div>
      <label className="flex items-center gap-1 whitespace-nowrap">
        <input
          type="checkbox"
          checked={playlist.isPublic}
          onChange={(e) =>
            setPlaylist({ ...playlist, isPublic: e.target.checked })
          }
        />
        Публичный
      </label>
      <button
        onClick={onSubmit}
        className="w-full sm:w-auto px-4 py-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
      >
        {isEdit ? "Сохранить" : "Создать"}
      </button>
      {isEdit && (
        <button
          onClick={() => setPlaylist(null)}
          className="w-full sm:w-auto px-4 py-2 bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-md"
        >
          Отмена
        </button>
      )}
    </div>
  );
}
