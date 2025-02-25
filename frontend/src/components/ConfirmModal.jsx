const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  actionText,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 dark:bg-black/80">
      <div className="relative w-full max-w-md p-4 md:p-6">
        <div className="rounded-lg bg-white shadow-lg dark:bg-main-dark dark:shadow-none">
          <div className="p-4 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-light-second-text">
              {message}
            </p>
          </div>

          <div className="flex justify-center gap-4 border-t border-gray-200 dark:border-dark-hover p-4">
            <button
              onClick={onClose}
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300 focus:outline-none dark:bg-dark-hover dark:text-white dark:hover:bg-dark-main"
            >
              Отмена
            </button>
            <button
              onClick={onConfirm}
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none dark:bg-red-700 dark:hover:bg-red-500"
            >
              {`${actionText}` || "Удалить"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
