import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/auth";
import SessionExpiredModal from "../components/SessionExpiredModal";
import { NotificationContainer } from "../components/Notification";
import { useEffect } from "react";

export default function Layout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSessionExpiredModalOpen } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSessionExpiredModalOpen) {
      const timer = setTimeout(() => {
        dispatch(logout());
        navigate("/login");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSessionExpiredModalOpen, dispatch, navigate]);

  return (
    <>
      <NotificationContainer />
      <Outlet />
      <SessionExpiredModal isOpen={isSessionExpiredModalOpen} />
    </>
  );
}
