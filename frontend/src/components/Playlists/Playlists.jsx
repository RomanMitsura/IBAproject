import { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useSelector } from "react-redux";
import { useOutletContext, useParams } from "react-router-dom";
import { showSuccess, showError } from "../Notification";
import ConfirmModal from "../ConfirmModal";
import PlaylistForm from "./PlaylistForm";
import PlaylistItem from "./PlaylistItem";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylist, setNewPlaylist] = useState({
    title: "",
    description: "",
    isPublic: false,
  });
  const [editPlaylist, setEditPlaylist] = useState(null);
  const [openPlaylists, setOpenPlaylists] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteType, setDeleteType] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deletePlaylistId, setDeletePlaylistId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const { userId } = useParams();
  const { profileUser, isOwnProfile } = useOutletContext();

  const fetchPlaylists = async () => {
    try {
      const url = isOwnProfile ? "/playlists" : `/playlists/user/${userId}`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPlaylists(res.data.playlists || []);
    } catch (error) {
      showError("Ошибка при загрузке плейлистов");
      console.error(error);
      setPlaylists([]);
    }
  };

  useEffect(() => {
    if (user || !isOwnProfile) fetchPlaylists();
  }, [user, userId, isOwnProfile]);

  const handleCreate = async () => {
    try {
      const res = await axios.post("/playlists", newPlaylist, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setPlaylists([...playlists, res.data.playlist]);
      setNewPlaylist({ title: "", description: "", isPublic: false });
      showSuccess("Плейлист создан");
    } catch (error) {
      showError("Ошибка при создании плейлиста");
      console.error(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        `/playlists/${editPlaylist._id}`,
        editPlaylist,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setPlaylists(
        playlists.map((pl) =>
          pl._id === editPlaylist._id ? res.data.playlist : pl
        )
      );
      setEditPlaylist(null);
      showSuccess("Плейлист обновлен");
    } catch (error) {
      showError("Ошибка при обновлении плейлиста");
      console.error(error);
    }
  };

  const confirmDelete = async () => {
    if (deleteType === "playlist") {
      try {
        await axios.delete(`/playlists/${deleteId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setPlaylists(playlists.filter((pl) => pl._id !== deleteId));
        setOpenPlaylists((prev) => {
          const newState = { ...prev };
          delete newState[deleteId];
          return newState;
        });
        showSuccess("Плейлист удален");
      } catch (error) {
        showError("Ошибка при удалении плейлиста");
        console.error(error);
      }
    } else if (deleteType === "video") {
      try {
        await axios.delete(
          `/playlists/${deletePlaylistId}/videos/${deleteId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        await fetchPlaylists();
        showSuccess("Видео удалено из плейлиста");
      } catch (error) {
        showError("Ошибка при удалении видео");
        console.error(error);
      }
    }
    setIsModalOpen(false);
    setDeleteType(null);
    setDeleteId(null);
    setDeletePlaylistId(null);
  };

  const handleDelete = (playlistId) => {
    setDeleteType("playlist");
    setDeleteId(playlistId);
    setIsModalOpen(true);
  };

  const handleRemoveVideo = (playlistId, videoId) => {
    setDeleteType("video");
    setDeleteId(videoId);
    setDeletePlaylistId(playlistId);
    setIsModalOpen(true);
  };

  const togglePlaylist = (playlistId) => {
    setOpenPlaylists((prev) => ({ ...prev, [playlistId]: !prev[playlistId] }));
  };

  if (!user && isOwnProfile) {
    return (
      <div className="text-center text-red-500 p-4">
        Авторизуйтесь для управления плейлистами
      </div>
    );
  }

  return (
    <div className="mx-auto p-4 max-full">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        {isOwnProfile
          ? "Мои плейлисты"
          : `Публичные плейлисты ${profileUser?.fullname || "Неизвестный пользователь"}`}
      </h1>

      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={confirmDelete}
        title={
          deleteType === "playlist" ? "Удаление плейлиста" : "Удаление видео"
        }
        message={
          deleteType === "playlist"
            ? "Вы уверены, что хотите удалить этот плейлист? Это действие нельзя отменить."
            : "Вы уверены, что хотите удалить это видео из плейлиста? Это действие нельзя отменить."
        }
        actionText="Удалить"
      />

      {isOwnProfile && (
        <PlaylistForm
          playlist={newPlaylist}
          setPlaylist={setNewPlaylist}
          onSubmit={handleCreate}
          isEdit={false}
        />
      )}

      {playlists.length === 0 ? (
        <p className="text-light-second-text text-center">
          {isOwnProfile
            ? "У вас пока нет плейлистов"
            : "У этого пользователя нет публичных плейлистов"}
        </p>
      ) : (
        <div className="space-y-4">
          {playlists.map((playlist) => (
            <PlaylistItem
              key={playlist._id}
              playlist={playlist}
              isOwnProfile={isOwnProfile}
              editPlaylist={editPlaylist}
              setEditPlaylist={setEditPlaylist}
              openPlaylists={openPlaylists}
              togglePlaylist={togglePlaylist}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
              handleRemoveVideo={handleRemoveVideo}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Playlists;
