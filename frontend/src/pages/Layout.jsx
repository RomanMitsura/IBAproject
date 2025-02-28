import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, closeSessionExpiredModal } from "../redux/slices/auth";
import ConfirmModal from "../components/ConfirmModal";
import { NotificationContainer } from "../components/Notification";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSessionExpiredModalOpen } = useSelector((state) => state.auth);

  const handleConfirmLogout = () => {
    dispatch(logout());
    dispatch(closeSessionExpiredModal());
    navigate("/login");
  };

  const handleCloseModal = () => {
    dispatch(closeSessionExpiredModal());
    navigate("/");
  };

  return (
    <>
      <NotificationContainer />
      <Outlet />
      <ConfirmModal
        isOpen={isSessionExpiredModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmLogout}
        title="Сессия завершена"
        message="Время действия вашей сессии истекло. Пожалуйста, войдите снова."
        actionText="Войти"
      />
    </>
  );
}
