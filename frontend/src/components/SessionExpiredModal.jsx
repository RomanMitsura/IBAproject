const SessionExpiredModal = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-black/50 dark:bg-black/80">
      <div className="relative w-full max-w-md p-4 md:p-6">
        <div className="rounded-lg bg-white shadow-lg dark:bg-main-dark dark:shadow-none">
          <div className="p-4 text-center">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Сессия завершена
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-light-second-text">
              Время жизни токена истекло. Вы будете перенаправлены на страницу
              логина через 5 секунд
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionExpiredModal;
