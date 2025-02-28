import { useState } from "react";
import axios from "../../utils/axios";
import { showError, showSuccess } from "../Notification";
import UserForm from "./UserForm";
import UserList from "./UserList";

export default function UsersPanel({
  users,
  setUsers,
  filteredUsers,
  setFilteredUsers,
  searchQuery,
  setSearchQuery,
  editUserData,
  setEditUserData,
  showPasswords,
  setShowPasswords,
  openDeleteModal,
}) {
  const [newUser, setNewUser] = useState({
    fullname: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleAddUser = async (userData) => {
    console.log("Отправляемые данные:", userData);
    try {
      const res = await axios.post("/admin/users", userData);
      console.log("Ответ сервера:", res.data);
      setUsers([...users, res.data.user]);
      setFilteredUsers([...filteredUsers, res.data.user]);
      setNewUser({ fullname: "", email: "", password: "", role: "user" });
      showSuccess("Пользователь добавлен");
    } catch (error) {
      console.error(
        "Ошибка при добавлении пользователя:",
        error.response?.data || error
      );
      showError(
        error.response?.data?.message || "Ошибка при добавлении пользователя"
      );
      throw error;
    }
  };

  const handleEditUser = async (id) => {
    try {
      const updatedUser = editUserData[id] || {};
      const currentUser = users.find((u) => u._id === id);
      const userData = {
        fullname: updatedUser.fullname || currentUser.fullname,
        email: updatedUser.email || currentUser.email,
        password: updatedUser.password || undefined,
        role: updatedUser.role || currentUser.role,
      };
      console.log("Данные для редактирования:", userData);
      const res = await axios.put(`/admin/users/${id}`, userData);
      console.log("Ответ сервера:", res.data);
      const updatedUsers = users.map((user) =>
        user._id === id ? res.data : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setEditUserData((prev) => {
        const newData = { ...prev };
        delete newData[id];
        return newData;
      });
      showSuccess("Пользователь обновлен");
    } catch (error) {
      console.error(
        "Ошибка при обновлении пользователя:",
        error.response?.data || error
      );
      throw error;
    }
  };

  const handleEditUserInputChange = (id, field, value) => {
    setEditUserData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="max-w-4xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Добавление пользователя</h2>
      <UserForm user={newUser} setUser={setNewUser} onSubmit={handleAddUser} />
      <h2 className="text-xl font-semibold mb-4">Пользователи</h2>
      <div className="flex flex-col gap-1 group relative mb-6 w-full max-w-md">
        <label
          htmlFor="searchUsers"
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Поиск пользователей
        </label>
        <input
          id="searchUsers"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
          placeholder="Поиск по имени или email"
        />
      </div>
      <UserList
        filteredUsers={filteredUsers}
        editUserData={editUserData}
        handleEditUserInputChange={handleEditUserInputChange}
        showPasswords={showPasswords}
        toggleShowPassword={toggleShowPassword}
        handleEditUser={handleEditUser}
        openDeleteModal={openDeleteModal}
      />
    </section>
  );
}
