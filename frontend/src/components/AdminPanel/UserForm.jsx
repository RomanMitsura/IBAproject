import { useState } from "react";

export default function UserForm({ user, setUser, onSubmit }) {
  const [errors, setErrors] = useState({});

  const validateFullname = (fullname) => {
    if (!fullname || fullname.length < 2) {
      return "Имя пользователя должно содержать минимум 2 символа";
    }
    return "";
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return "Введите корректный email";
    }
    return "";
  };

  const validatePassword = (password) => {
    const minLength = 6;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (!password || password.length < minLength) {
      return "Пароль должен содержать минимум 6 символов";
    }
    if (!hasLetter || !hasNumber) {
      return "Пароль должен содержать буквы и цифры";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const { fullname, email, password } = user;
    const fullnameError = validateFullname(fullname);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    const errorMessages = [];
    if (fullnameError) errorMessages.push(fullnameError);
    if (emailError) errorMessages.push(emailError);
    if (passwordError) errorMessages.push(passwordError);

    if (errorMessages.length > 0) {
      setErrors({
        fullname: fullnameError ? true : false,
        email: emailError ? true : false,
        password: passwordError ? true : false,
        general: errorMessages.join("; "),
      });
      return;
    }

    try {
      await onSubmit({
        fullname,
        email,
        password,
        role: user.role,
      });
    } catch (error) {
      console.error("Ошибка при добавлении пользователя:", error);
      const errorMessage =
        error.response?.data?.message || "Ошибка при добавлении пользователя";

      if (errorMessage.includes("email")) {
        setErrors({ email: true, general: errorMessage });
      } else if (errorMessage.includes("пароль")) {
        setErrors({ password: true, general: errorMessage });
      } else if (errorMessage.includes("имя")) {
        setErrors({ fullname: true, general: errorMessage });
      } else {
        setErrors({ general: errorMessage });
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 mb-6 sm:grid sm:grid-cols-2 md:grid-cols-5 sm:gap-4 sm:items-end"
    >
      <div className="flex flex-col gap-1 group relative">
        <label
          htmlFor="newUserFullName"
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Имя
        </label>
        <input
          id="newUserFullName"
          type="text"
          value={user.fullname || ""}
          onChange={(e) => setUser({ ...user, fullname: e.target.value })}
          className={`px-3 py-2 rounded border focus:outline-none ${
            errors.fullname ? "border-red-500" : "focus:border-blue-400 "
          }`}
          placeholder="Введите имя"
          required
        />
      </div>
      <div className="flex flex-col gap-1 group relative">
        <label
          htmlFor="newUserEmail"
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Email
        </label>
        <input
          id="newUserEmail"
          type="email"
          value={user.email || ""}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className={`px-3 py-2 rounded border focus:outline-none ${
            errors.email ? "border-red-500" : "focus:border-blue-400"
          }`}
          placeholder="Введите email"
          required
        />
      </div>
      <div className="flex flex-col gap-1 group relative">
        <label
          htmlFor="newUserPassword"
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Пароль
        </label>
        <input
          id="newUserPassword"
          type="password"
          value={user.password || ""}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className={`px-3 py-2 rounded border focus:outline-none ${
            errors.password ? "border-red-500" : "focus:border-blue-400 "
          }`}
          placeholder="Введите пароль"
          required
        />
      </div>
      <div className="flex flex-col gap-1 group relative">
        <label
          htmlFor="newUserRole"
          className="absolute -top-3 ml-3 px-1 bg-white dark:bg-[#0f0f0f] group-focus-within:text-blue-400"
        >
          Роль
        </label>
        <select
          id="newUserRole"
          value={user.role || "user"}
          onChange={(e) => setUser({ ...user, role: e.target.value })}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400 bg-white dark:bg-[#0f0f0f] appearance-none"
        >
          <option value="user">Пользователь</option>
          <option value="admin">Администратор</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 rounded-md bg-main-light hover:bg-light-hover dark:bg-main-dark dark:hover:bg-dark-hover transition duration-300 w-full sm:w-auto"
      >
        Добавить
      </button>
      {errors.general && (
        <p className="text-red-500 text-sm col-span-full">{errors.general}</p>
      )}
    </form>
  );
}
