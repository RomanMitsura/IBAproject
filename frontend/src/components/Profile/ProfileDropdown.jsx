import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export default function ProfileDropdown({ isAdmin }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="mt-2 px-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover focus:outline-none"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 right-0 w-48 mt-1 rounded-md shadow-lg bg-white dark:bg-main-dark ring-1 ring-black ring-opacity-5">
          <div className="py-1" role="menu">
            <Link
              to="/profile/add-video"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-hover"
              onClick={() => setIsOpen(false)}
            >
              Добавить видео
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-dark-hover"
                onClick={() => setIsOpen(false)}
              >
                Админ-панель
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
