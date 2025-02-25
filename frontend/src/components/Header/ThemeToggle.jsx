export default function ThemeToggle({ isDarkMode, onToggle }) {
  return (
    <div className="flex items-center gap-2">
      <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">
        {isDarkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 xl:block hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6 sm:block hidden"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
            />
          </svg>
        )}
      </span>
      <button
        onClick={onToggle}
        className={`relative sm:w-12 sm:h-6 w-10 h-5 rounded-full transition-all duration-300 focus:outline-none ${
          isDarkMode ? "bg-main-dark" : "bg-gray-200"
        }`}
      >
        <span
          className={`absolute left-1 top-1 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isDarkMode
              ? "translate-x-5 sm:translate-x-6"
              : "translate-x-0 sm:translate-x-0"
          }`}
        ></span>
      </button>
    </div>
  );
}
