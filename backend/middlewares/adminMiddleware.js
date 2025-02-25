// middleware/admin.js
export default function admin(req, res, next) {
  try {
    // Предполагаем, что auth middleware уже добавил пользователя в req.user
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Необходима аутентификация" }, console.log("Ошибка!"));
    }

    // Проверяем роль пользователя
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен: требуется роль администратора",
      });
    }

    // Если пользователь администратор, продолжаем выполнение
    next();
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера в middleware admin" });
  }
}
