import multer from "multer";
import path from "path";
import fs from "fs";

// Функция для проверки и создания папки uploads
const ensureUploadsDirectoryExists = () => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("Папка 'uploads' успешно создана");
  }
};

// Убедитесь, что папка uploads существует
ensureUploadsDirectoryExists();

// Настройка хранилища для файлов
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Папка, куда будут сохраняться файлы
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

// Фильтр для разрешенных типов файлов
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "image/webp"]; // Добавлен image/webp
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Недопустимый тип файла"), false);
  }
};

// Инициализация multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

export default upload;
