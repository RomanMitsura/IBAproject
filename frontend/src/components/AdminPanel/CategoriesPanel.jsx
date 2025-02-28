import { useState } from "react";
import axios from "../../utils/axios";
import { showError, showSuccess } from "../Notification";
import { Link } from "react-router-dom";

export default function CategoriesPanel({
  categories,
  setCategories,
  editCategoryData,
  setEditCategoryData,
  openDeleteModal,
}) {
  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      showError("Название категории не может быть пустым");
      return;
    }
    try {
      const res = await axios.post("/admin/categories", { name: newCategory });
      setCategories([...categories, res.data]);
      setNewCategory("");
      showSuccess("Категория добавлена");
    } catch (error) {
      showError("Ошибка при добавлении категории");
      console.error(error);
    }
  };

  const handleEditCategoryInputChange = (id, value) => {
    setEditCategoryData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleEditCategory = async (id) => {
    try {
      const updatedName =
        editCategoryData[id] || categories.find((cat) => cat._id === id).name;
      if (!updatedName.trim()) {
        showError("Название категории не может быть пустым");
        return;
      }
      const res = await axios.put(`/admin/categories/${id}`, {
        name: updatedName,
      });
      setCategories(categories.map((cat) => (cat._id === id ? res.data : cat)));
      setEditCategoryData((prev) => {
        const newData = { ...prev };
        delete newData[id];
        return newData;
      });
      showSuccess("Категория обновлена");
    } catch (error) {
      console.error(error);
      showError("Ошибка при обновлении категории");
    }
  };

  return (
    <section className="w-full max-w-4xl mx-auto  p-6  ">
      <Link to="/" className="absolute top-4 left-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="size-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </Link>
      <h2 className="text-xl font-semibold mb-4">Категории</h2>
      <form
        onSubmit={handleAddCategory}
        className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-end"
      >
        <div className="flex flex-col gap-1 group relative flex-1">
          <label
            htmlFor="newCategory"
            className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
          >
            Название категории
          </label>
          <input
            id="newCategory"
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
            placeholder="Введите название категории"
            required
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300 sm:w-auto w-full"
        >
          Добавить
        </button>
      </form>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col sm:flex-row gap-4 sm:items-end"
          >
            <div className="flex flex-col gap-1 group relative flex-1">
              <label
                htmlFor={`category-${cat._id}`}
                className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
              >
                Название
              </label>
              <input
                id={`category-${cat._id}`}
                type="text"
                value={editCategoryData[cat._id] ?? cat.name}
                onChange={(e) =>
                  handleEditCategoryInputChange(cat._id, e.target.value)
                }
                className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => handleEditCategory(cat._id)}
                className="px-4 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300 sm:w-auto w-full"
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
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </button>
              <button
                onClick={() => openDeleteModal(cat._id)}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300 sm:w-auto w-full"
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
                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
