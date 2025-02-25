export default function admin(req, res, next) {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Необходима аутентификация" }, console.log("Ошибка!"));
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Доступ запрещен: требуется роль администратора",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Ошибка сервера в middleware admin" });
  }
}
