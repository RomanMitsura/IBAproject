import { useState, useEffect, useRef } from "react";
import axios from "../axios";

export default function CategoryFilter({ onCategoryChange, selectedCategory }) {
  const [categories, setCategories] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка при загрузке категорий:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategory = (categoryId) => {
    onCategoryChange(categoryId === selectedCategory ? "" : categoryId);
    setIsOpen(false);
  };

  const toggleAccordion = () => {
    setIsOpen((prev) => !prev);
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-4">
      <div className="sm:hidden">
        <button
          onClick={toggleAccordion}
          className="w-full px-2 py-1 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover flex justify-between items-center"
        >
          <span>Категории</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className={`size-6 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="mt-2 flex flex-col gap-2">
            <button
              onClick={() => handleCategory("")}
              className={`px-2 py-1 rounded-md text-left ${
                selectedCategory === ""
                  ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
                  : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
              }`}
            >
              Все категории
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => handleCategory(category._id)}
                className={`px-2 py-1 rounded-md text-left ${
                  selectedCategory === category._id
                    ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
                    : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:flex max-w-4xl mx-auto items-center gap-4">
        <button
          onClick={scrollLeft}
          className="bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-full p-1 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scroll-smooth hide-scrollbar justify-center flex-1 px-6" // Увеличил отступы до px-6
        >
          <button
            onClick={() => handleCategory("")}
            className={`px-2 py-1 rounded-md whitespace-nowrap ${
              selectedCategory === ""
                ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
                : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
            }`}
          >
            Все категории
          </button>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => handleCategory(category._id)}
              className={`px-2 py-1 rounded-md whitespace-nowrap ${
                selectedCategory === category._id
                  ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
                  : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover rounded-full p-1 shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

const customStyles = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none; 
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = customStyles;
document.head.appendChild(styleSheet);
