import { useState } from "react";
import { showError } from "../Notification";

export default function UserList({
  filteredUsers,
  editUserData,
  handleEditUserInputChange,
  showPasswords,
  toggleShowPassword,
  handleEditUser,
  openDeleteModal,
}) {
  const [errors, setErrors] = useState({});

  const validateFullname = (fullname) => {
    if (fullname && fullname.length < 2) {
      return "Имя пользователя должно содержать минимум 2 символа";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return "Введите корректный email";
      }
    }
    return "";
  };

  const validatePassword = (password) => {
    if (password) {
      const minLength = 6;
      const hasLetter = /[a-zA-Z]/.test(password);
      const hasNumber = /\d/.test(password);

      if (password.length < minLength) {
        return "Пароль должен содержать минимум 6 символов";
      }
      if (!hasLetter || !hasNumber) {
        return "Пароль должен содержать буквы и цифры";
      }
    }
    return "";
  };

  const handleSubmitEdit = async (id) => {
    setErrors((prev) => ({ ...prev, [id]: {} }));

    const userData = editUserData[id] || {};
    const fullnameError = validateFullname(userData.fullname);
    const emailError = validateEmail(userData.email);
    const passwordError = validatePassword(userData.password);

    if (fullnameError || emailError || passwordError) {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          fullname: fullnameError,
          email: emailError,
          password: passwordError,
        },
      }));
      return;
    }

    try {
      await handleEditUser(id);
    } catch (error) {
      showError(
        error.response?.data?.message || "Ошибка при обновлении пользователя"
      );
    }
  };

  return (
    <div className="space-y-10">
      {filteredUsers.map((user) => (
        <div key={user._id} className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-1 group relative">
              <label
                htmlFor={`user-fullname-${user._id}`}
                className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
              >
                Имя
              </label>
              <input
                id={`user-fullname-${user._id}`}
                type="text"
                value={editUserData[user._id]?.fullname ?? user.fullname}
                onChange={(e) =>
                  handleEditUserInputChange(
                    user._id,
                    "fullname",
                    e.target.value
                  )
                }
                className={`px-3 py-2 rounded border focus:outline-none ${
                  errors[user._id]?.fullname
                    ? "border-red-500"
                    : "focus:border-blue-400"
                }`}
              />
              {errors[user._id]?.fullname && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[user._id].fullname}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 group relative">
              <label
                htmlFor={`user-email-${user._id}`}
                className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
              >
                Email
              </label>
              <input
                id={`user-email-${user._id}`}
                type="email"
                value={editUserData[user._id]?.email ?? user.email}
                onChange={(e) =>
                  handleEditUserInputChange(user._id, "email", e.target.value)
                }
                className={`px-3 py-2 rounded border focus:outline-none ${
                  errors[user._id]?.email
                    ? "border-red-500"
                    : "focus:border-blue-400"
                }`}
              />
              {errors[user._id]?.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[user._id].email}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex flex-col gap-1 group relative">
              <label
                htmlFor={`user-password-${user._id}`}
                className="absolute z-1 -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
              >
                Пароль
              </label>
              <div className="relative">
                <input
                  id={`user-password-${user._id}`}
                  type={showPasswords[user._id] ? "text" : "password"}
                  value={editUserData[user._id]?.password ?? ""}
                  onChange={(e) =>
                    handleEditUserInputChange(
                      user._id,
                      "password",
                      e.target.value
                    )
                  }
                  className={`px-3 py-2 rounded border focus:outline-none ${
                    errors[user._id]?.password
                      ? "border-red-500"
                      : "focus:border-blue-400"
                  } w-full`}
                  placeholder="Введите новый пароль"
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword(user._id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-light-second-text hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {showPasswords[user._id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors[user._id]?.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors[user._id].password}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1 group relative">
              <label
                htmlFor={`user-role-${user._id}`}
                className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
              >
                Роль
              </label>
              <select
                id={`user-role-${user._id}`}
                value={editUserData[user._id]?.role ?? user.role}
                onChange={(e) =>
                  handleEditUserInputChange(user._id, "role", e.target.value)
                }
                className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400 bg-white dark:bg-[#0f0f0f] appearance-none"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row md:flex-col md:items-end">
            <button
              onClick={() => handleSubmitEdit(user._id)}
              className="px-4 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300 w-full sm:w-auto"
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
              onClick={() => openDeleteModal(user._id)}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition duration-300 w-full sm:w-auto"
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
  );
}
