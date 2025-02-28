import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoriesPanel from "./CategoriesPanel";
import UsersPanel from "./UsersPanel";
import axios from "../../utils/axios";
import ConfirmModal from "../ConfirmModal";
import { showError, showSuccess } from "../Notification";

export default function AdminPanel() {
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editCategoryData, setEditCategoryData] = useState({});
  const [editUserData, setEditUserData] = useState({});
  const [showPasswords, setShowPasswords] = useState({});
  const [activePanel, setActivePanel] = useState("users");
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] =
    useState(false);
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, usersRes] = await Promise.all([
        axios.get("/admin/categories"),
        axios.get("/admin/users"),
      ]);
      setCategories(categoriesRes.data);
      setUsers(usersRes.data);
      setFilteredUsers(usersRes.data);
    } catch (error) {
      showError("Ошибка при загрузке данных");
      console.error(error);
    }
  };

  useEffect(() => {
    const filtered = users.filter((user) =>
      `${user.fullname} ${user.email}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  const handleCreateUser = async (userData) => {
    try {
      const response = await axios.post("/admin/users", userData);
      const newUser = response.data.user;
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setFilteredUsers((prevFiltered) => [...prevFiltered, newUser]);
      showSuccess("Пользователь успешно добавлен");
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
      throw error;
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`/admin/categories/${itemToDelete}`);
      setCategories(categories.filter((cat) => cat._id !== itemToDelete));
      setIsDeleteCategoryModalOpen(false);
      setItemToDelete(null);
      showSuccess("Категория удалена");
    } catch (error) {
      console.error(error);
      showError("Ошибка при удалении категории");
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`/admin/users/${itemToDelete}`);
      const updatedUsers = users.filter((user) => user._id !== itemToDelete);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setIsDeleteUserModalOpen(false);
      setItemToDelete(null);
      showSuccess("Пользователь удален");
    } catch (error) {
      console.error(error);
      showError("Ошибка при удалении пользователя");
    }
  };

  return (
    <div className="flex flex-col gap-6 min-h-screen px-4 py-8 relative">
      <Link to=".." className="absolute top-4 left-4">
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
      <h1 className="font-bold text-2xl text-center">Админ-панель</h1>
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActivePanel("users")}
          className={`px-6 py-1 rounded-md whitespace-nowrap ${
            activePanel === "users"
              ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
              : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
          }`}
        >
          Пользователи
        </button>
        <button
          onClick={() => setActivePanel("categories")}
          className={`px-6 py-1 rounded-md whitespace-nowrap ${
            activePanel === "categories"
              ? "bg-light-active text-white dark:bg-dark-active dark:text-black"
              : "bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover"
          }`}
        >
          Категории
        </button>
      </div>
      {activePanel === "categories" && (
        <CategoriesPanel
          categories={categories}
          setCategories={setCategories}
          editCategoryData={editCategoryData}
          setEditCategoryData={setEditCategoryData}
          openDeleteModal={(id) => {
            setItemToDelete(id);
            setIsDeleteCategoryModalOpen(true);
          }}
        />
      )}
      {activePanel === "users" && (
        <UsersPanel
          users={users}
          setUsers={setUsers}
          filteredUsers={filteredUsers}
          setFilteredUsers={setFilteredUsers}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          editUserData={editUserData}
          setEditUserData={setEditUserData}
          showPasswords={showPasswords}
          setShowPasswords={setShowPasswords}
          openDeleteModal={(id) => {
            setItemToDelete(id);
            setIsDeleteUserModalOpen(true);
          }}
          handleCreateUser={handleCreateUser}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => {
          setIsDeleteCategoryModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteCategory}
        title="Удаление категории"
        message="Вы уверены, что хотите удалить эту категорию?"
        actionText="Удалить"
      />
      <ConfirmModal
        isOpen={isDeleteUserModalOpen}
        onClose={() => {
          setIsDeleteUserModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        title="Удаление пользователя"
        message="Вы уверены, что хотите удалить этого пользователя?"
        actionText="Удалить"
      />
    </div>
  );
}
