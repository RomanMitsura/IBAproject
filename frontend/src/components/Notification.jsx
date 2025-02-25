// Notification.jsx
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

export const NotificationContainer = () => {
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  return (
    <ToastContainer
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"} // Используем Redux вместо localStorage
      className="mt-16"
    />
  );
};

export const showSuccess = (message) => {
  toast.success(message, {
    className:
      "bg-[var(--color-main-light)] dark:bg-[var(--color-main-dark)] text-[var(--color-light-active)] dark:text-[var(--color-dark-active)]",
    progressClassName:
      "bg-[var(--color-dark-hover)] dark:bg-[var(--color-dark-active)]",
  });
};

export const showError = (message) => {
  toast.error(message, {
    className:
      "bg-[var(--color-main-light)] dark:bg-[var(--color-main-dark)] text-[var(--color-light-active)] dark:text-[var(--color-dark-active)]",
    progressClassName: "bg-red-500",
  });
};
