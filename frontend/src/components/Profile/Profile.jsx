import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { logout } from "../../redux/slices/auth";
import axios from "../../utils/axios";
import ConfirmModal from "../../components/ConfirmModal";
import ProfileHeader from "./ProfileHeader";
import ProfileNav from "./ProfileNav";

export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useParams();
  const user = useSelector((state) => state.auth.user);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [profileUser, setProfileUser] = useState(null);

  const fetchUserProfile = async (id) => {
    try {
      const response = await axios.get(`/users/${id}`);
      setProfileUser(response.data.user);
    } catch (error) {
      if (error.response?.status === 404) {
        navigate("/not-found");
      } else {
        navigate("/error");
      }
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const handleDeleteProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        await dispatch(logout());
        navigate("/");
      }
    } catch (error) {
      navigate("/error");
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserProfile(userId);
    }
  }, [userId]);

  if (!profileUser) {
    return <div className="text-center py-10">Загрузка...</div>;
  }

  const isOwnProfile = user && user.id === profileUser.id;
  const isAdmin = user && user.role === "admin";

  return (
    <div className="mx-auto">
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          handleLogout();
          setIsModalOpen(false);
        }}
        title="Выход"
        message="Вы уверены, что хотите выйти?"
        actionText="Выйти"
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          handleDeleteProfile();
          setIsDeleteModalOpen(false);
        }}
        title="Удаление профиля"
        message="Вы уверены, что хотите удалить свой профиль? Это действие нельзя отменить."
        actionText="Удалить"
        actionButtonClass="bg-red-700 hover:bg-red-500"
      />

      <ProfileHeader
        profileUser={profileUser}
        isOwnProfile={isOwnProfile}
        isAdmin={isAdmin}
        onLogout={() => setIsModalOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
      />
      <ProfileNav isOwnProfile={isOwnProfile} isAdmin={isAdmin} />
      <Outlet context={{ profileUser, isOwnProfile }} />
    </div>
  );
}
