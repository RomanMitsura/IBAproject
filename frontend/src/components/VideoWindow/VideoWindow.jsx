import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux"; // Добавляем useDispatch
import axios from "../../utils/axios";
import { showSuccess, showError } from "../Notification";
import { fetchAuthMe } from "../../redux/slices/auth"; // Импортируем fetchAuthMe
import VideoPlayer from "./VideoPlayer";
import VideoControls from "./VideoControls";
import VideoInfo from "./VideoInfo";
import VideoStats from "./VideoStats";
import PlaylistSelector from "./PlaylistSelector";
import Comments from "../Comments/Comments";
import SideAllVideos from "../SideAllVideos";
import ConfirmModal from "../ConfirmModal";

export default function VideoWindow() {
  const [data, setData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const { videoId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Для вызова fetchAuthMe
  const user = useSelector((state) => state.auth.user);
  const isAuthChecked = useSelector((state) => state.auth.isAuthChecked); // Проверка авторизации
  const MAX_VIEWS_FOR_GUEST = 10;

  const getViewCount = () =>
    parseInt(localStorage.getItem("guestVideoViews")) || 0;
  const incrementViewCount = () => {
    const currentCount = getViewCount();
    localStorage.setItem("guestVideoViews", currentCount + 1);
  };

  useEffect(() => {
    // Проверяем авторизацию при монтировании, если есть токен
    if (localStorage.getItem("token") && !isAuthChecked) {
      dispatch(fetchAuthMe());
    } else if (!localStorage.getItem("token")) {
      // Если токена нет, сразу считаем проверку завершенной
      dispatch({ type: "auth/setAuthChecked" }); // Может потребоваться отдельный action
    }
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Ждем завершения проверки авторизации
        if (!isAuthChecked) return;

        // Проверка лимита только для гостей
        if (!user) {
          const viewCount = getViewCount();
          if (viewCount >= MAX_VIEWS_FOR_GUEST) {
            setShowLimitModal(true);
            setIsLoading(false);
            return;
          }
        }

        const token = user ? localStorage.getItem("token") : null;
        const [videoRes, playlistsRes] = await Promise.all([
          axios.get(`/videos/${videoId}`),
          user && token
            ? axios.get("/playlists", {
                headers: { Authorization: `Bearer ${token}` },
              })
            : Promise.resolve({ data: { playlists: [] } }),
        ]);

        setData(videoRes.data.video);
        setPlaylists(playlistsRes.data.playlists);

        if (!user) {
          incrementViewCount();
        }
      } catch (err) {
        console.warn("Ошибка при загрузке данных:", err);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [videoId, user, isAuthChecked]);

  const handleDelete = async () => {
    if (!user) {
      showError("Войдите в систему для удаления видео");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Токен не найден. Пожалуйста, войдите заново");
        navigate("/login");
        return;
      }
      const response = await axios.delete(`/videos/${videoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        showSuccess("Видео успешно удалено");
        navigate("/");
      } else {
        showError(response.data.message || "Ошибка при удалении видео");
      }
    } catch (error) {
      showError("Произошла ошибка при удалении видео");
      console.error(error);
    }
  };

  const handleLike = async () => {
    if (!user) {
      showError("Войдите в систему для постановки лайка");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Токен не найден. Пожалуйста, войдите заново");
        navigate("/login");
        return;
      }
      const res = await axios.post(
        `/videos/${videoId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
        likedBy: res.data.likedBy,
        dislikedBy: res.data.dislikedBy,
      }));
    } catch (error) {
      showError("Ошибка при постановке лайка");
      console.error(error);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      showError("Войдите в систему для постановки дизлайка");
      navigate("/login");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Токен не найден. Пожалуйста, войдите заново");
        navigate("/login");
        return;
      }
      const res = await axios.post(
        `/videos/${videoId}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData((prev) => ({
        ...prev,
        likes: res.data.likes,
        dislikes: res.data.dislikes,
        likedBy: res.data.likedBy,
        dislikedBy: res.data.dislikedBy,
      }));
    } catch (error) {
      showError("Ошибка при постановке дизлайка");
      console.error(error);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    if (!user) {
      showError("Войдите в систему для добавления видео в плейлист");
      navigate("/login");
      return;
    }
    if (!playlistId) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showError("Токен не найден. Пожалуйста, войдите заново");
        navigate("/login");
        return;
      }
      const res = await axios.post(
        `/playlists/${playlistId}/videos/${videoId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      showSuccess("Видео добавлено в плейлист");
      setPlaylists((prev) =>
        prev.map((pl) => (pl._id === playlistId ? res.data.playlist : pl))
      );
    } catch (error) {
      showError("Ошибка при добавлении видео в плейлист");
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="text-center text-blue-500">Загрузка...</div>;
  }

  return (
    <div className="mx-auto xl:flex">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Удаление видео"
        message="Вы уверены, что хотите удалить это видео? Это действие нельзя отменить."
        actionText="Удалить"
      />
      <ConfirmModal
        isOpen={showLimitModal}
        onClose={() => navigate("/")}
        onConfirm={() => navigate("/login")}
        title="Лимит просмотров"
        message="Вы превысили лимит просмотра 10 видео. Авторизуйтесь для продолжения."
        actionText="Войти"
      />
      {data ? (
        <>
          <div className="xl:w-4/5">
            <VideoPlayer data={data} />
            <VideoControls
              user={user}
              data={data}
              videoId={videoId}
              onDelete={() => setIsModalOpen(true)}
            />
            <div className="flex justify-between mt-5">
              <VideoInfo data={data} />
              <VideoStats
                data={data}
                user={user}
                onLike={handleLike}
                onDislike={handleDislike}
              />
            </div>
            <PlaylistSelector
              user={user}
              playlists={playlists}
              onAddToPlaylist={handleAddToPlaylist}
            />
            <Comments videoId={videoId} videoAuthorId={data.user._id} />
          </div>
          <div className="xl:w-1/5 xl:mt-0 mt-10 px-4">
            <p className="font-bold text-xl mb-4 text-center">
              Видео пользователя
            </p>
            <SideAllVideos videoId={videoId} userId={data.user._id} />
          </div>
        </>
      ) : (
        !showLimitModal && (
          <div className="text-center text-red-500">Видео не найдено</div>
        )
      )}
    </div>
  );
}
