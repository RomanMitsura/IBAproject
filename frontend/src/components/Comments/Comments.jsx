import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../../axios";
import ConfirmModal from "../ConfirmModal";
import { showError, showSuccess } from "../Notification";
import CommentForm from "./CommentForm";
import CommentAccordion from "./CommentAccordion";
import CommentList from "./CommentList";

export default function Comments({ videoId, videoAuthorId }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/comment/${videoId}`);
        setData(res.data.comments || []);
      } catch (err) {
        console.warn(err);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [videoId]);

  const handleDelete = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`/comment/${videoId}/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        showSuccess("Комментарий успешно удален");
        setData((prevData) => prevData.filter((c) => c._id !== commentId));
      } else {
        showError(response.data.message || "Ошибка при удалении комментария");
      }
    } catch (error) {
      showError(
        "Ошибка при удалении комментария. Попробуйте обновить страницу и повторить действие"
      );
      console.error(error);
    }
  };

  const handleAddComment = async () => {
    if (!token || !user) {
      showError("Авторизуйтесь, чтобы оставить комментарий");
      return;
    }
    if (!commentText.trim()) {
      showError("Комментарий не может быть пустым");
      return;
    }

    try {
      const newComment = {
        text: commentText,
        user: {
          avatarUrl: user.avatarUrl,
          _id: user.id,
          fullname: user.fullname,
        },
        createdAt: new Date().toISOString(),
      };

      await axios.post(
        `/comment/${videoId}`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setData((prevData) => [...prevData, newComment]);
      setCommentText("");
      showSuccess("Комментарий добавлен");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      showError("Не удалось добавить комментарий");
    }
  };

  const canDeleteComment = (comment) => {
    if (!user) return false;
    const isCommentAuthor = comment.user._id === user.id;
    const isVideoAuthor = videoAuthorId === user.id;
    const isAdmin = user.role === "admin";
    return isCommentAuthor || isVideoAuthor || isAdmin;
  };

  if (isLoading) {
    return <div className="text-center text-blue-500">Загрузка...</div>;
  }

  return (
    <div className="w-full">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => {
          setDeletingCommentId(null);
          setIsModalOpen(false);
        }}
        onConfirm={() => {
          handleDelete(deletingCommentId);
          setIsModalOpen(false);
        }}
        title="Удаление комментария"
        message="Вы уверены, что хотите удалить этот комментарий? Это действие нельзя отменить."
        actionText="Удалить"
      />
      <span className="text-xl font-bold">Комментарии</span>
      <CommentForm
        user={user}
        token={token}
        commentText={commentText}
        setCommentText={setCommentText}
        onAddComment={handleAddComment}
      />
      <CommentAccordion
        comments={data}
        videoAuthorId={videoAuthorId}
        canDeleteComment={canDeleteComment}
        onDelete={(commentId) => {
          setDeletingCommentId(commentId);
          setIsModalOpen(true);
        }}
      />
      <CommentList
        comments={data}
        videoAuthorId={videoAuthorId}
        canDeleteComment={canDeleteComment}
        onDelete={(commentId) => {
          setDeletingCommentId(commentId);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}
