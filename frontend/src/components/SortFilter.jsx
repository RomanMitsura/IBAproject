export default function SortFilter({ sortBy, onSort }) {
  const sortOptions = [
    { value: "new", label: "Новое" },
    { value: "views", label: "Просмотры" },
    { value: "likes", label: "Лайки" },
  ];

  return (
    <div className="flex gap-2 mb-4 justify-center md:justify-start">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          onClick={() => onSort(option.value)}
          className={`px-2 py-1 rounded-md ${
            sortBy === option.value
              ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
              : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
