import { Navigate, Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "../utils/axios";
import { showError } from "./Notification";

export default function ProtectedRoute({
  requireAdmin = false,
  requireCreator = false,
}) {
  const { user, token } = useSelector((state) => state.auth);
  const { videoId } = useParams();
  const [videoCreatorId, setVideoCreatorId] = useState(null);
  const [isLoading, setIsLoading] = useState(requireCreator);
  const isAuthenticated = !!token && !!user;

  useEffect(() => {
    const checkCreator = async () => {
      if (requireCreator && videoId && token) {
        try {
          const response = await axios.get(`/videos/${videoId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const video = response.data.video;
          setVideoCreatorId(video.user._id || video.user);
        } catch (error) {
          setVideoCreatorId(null);
          showError("Не удалось загрузить данные видео");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    checkCreator();
  }, [videoId, token, requireCreator]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (requireAdmin && user.role !== "admin") {
    showError("Доступ только для администраторов");
    return <Navigate to="/" replace />;
  }

  if (
    requireCreator &&
    videoCreatorId &&
    user._id !== videoCreatorId &&
    user.role !== "admin"
  ) {
    showError("Вы не можете редактировать это видео");
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
