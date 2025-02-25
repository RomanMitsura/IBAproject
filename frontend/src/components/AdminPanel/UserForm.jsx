export default function UserForm({ user, setUser, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
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
          value={user.fullname}
          onChange={(e) => setUser({ ...user, fullname: e.target.value })}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
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
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
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
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          className="px-3 py-2 rounded border focus:outline-none focus:border-blue-400"
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
          value={user.role}
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
    </form>
  );
}
