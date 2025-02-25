import { Link } from "react-router-dom";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-10 ">
      <div className="text-center bg-white dark:bg-black/80 p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
          Ошибка на сервере
        </h1>
        <p className="text-light-second-text  mb-6">
          Что-то пошло не так. Попробуйте вернуться на главную страницу или
          обновить страницу позже.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover  font-semibold transition duration-300"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
