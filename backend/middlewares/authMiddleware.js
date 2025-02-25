import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Токен не предоставлен" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Ошибка при проверке токена:", error);
    res.status(401).json({ message: "Неверный или просроченный токен" });
  }
}
