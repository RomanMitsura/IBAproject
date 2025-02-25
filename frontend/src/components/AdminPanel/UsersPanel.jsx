import { useState } from "react";
import axios from "../../axios";
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

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/admin/users", newUser);
      setUsers([...users, res.data]);
      setFilteredUsers([...users, res.data]);
      setNewUser({ fullname: "", email: "", password: "", role: "user" });
      showSuccess("Пользователь добавлен");
    } catch (error) {
      console.error(error);
      showError("Ошибка при добавлении пользователя");
    }
  };

  const handleEditUserInputChange = (id, field, value) => {
    setEditUserData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleEditUser = async (id) => {
    try {
      const updatedUser = editUserData[id] || {};
      const res = await axios.put(`/admin/users/${id}`, {
        fullname:
          updatedUser.fullname || users.find((u) => u._id === id).fullname,
        email: updatedUser.email || users.find((u) => u._id === id).email,
        password: updatedUser.password || undefined,
        role: updatedUser.role || users.find((u) => u._id === id).role,
      });
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
      console.error(error);
      showError("Ошибка при обновлении пользователя");
    }
  };

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className=" max-w-4xl mx-auto  p-6  ">
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
