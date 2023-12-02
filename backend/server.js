require("colors");
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const path = require("path");
const connectDB = require("../config/connectDB");
const UserModel = require("./models/UserModel");
const authMiddleware = require("./middlewares/authMiddleware");
const configPath = path.join(__dirname, "..", "config", ".env");

require("dotenv").config({ path: configPath });

// console.log(process.env.PORT);
// console.log(process.env.DB_STRING);

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//реєстрація - це збереження користувача у базу даних
app.post("/register", async (req, res) => {
  try {
    //отримуємо дані від користувача та валідуємо
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please, provide all required fields");
    }
    //шукаємо користувача в базі
    const candidate = await UserModel.findOne({ email });
    //якщо знайшли, видаємо помилку
    if (candidate) {
      res.status(400);
      throw new Error("User already exists");
    }
    //якщо не знайшли, хешуємо пароль
    const hashPassword = bcrypt.hashSync(password, 5);

    // якщо все ок, то зберігаємо в базу користувача
    const user = await UserModel.create({
      ...req.body,
      password: hashPassword,
    });
    res.status(201).json({
      code: 200,
      data: {
        email: user.email,
      },
    });
  } catch (error) {
    res.status(res.statusCode);
    res.json({
      code: res.statusCode,
      message: error.message,
    });
  }
});

// аутентифікація - це перевірка даних, які надав користувач, та порівняння їх з тими, що зберігаються в базі
app.post("/login", async (req, res) => {
  try {
    // //отримуємо дані від користувача та валідуємо
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please, provide all required fields");
    }
    // //шукаємо користувача в базі і розшифровуємо пароль
    //якщо не знайшли або не розшифрували пароль, видаємо помилку  - invalid login or password
    const candidate = await UserModel.findOne({ email });
    if (!candidate || !bcrypt.compareSync(password, candidate.password)) {
      res.status(400);
      throw new Error("Invalid login or password");
    }

    //якщо знайшли і розшифрували пароль, то видаємо токен

    const token = generateToken({
      students: ["Kate", "Dolphin", "Alex", "Oleg"],
      teacher: "Andr",
      id: candidate._id,
    });

    console.log(token);
    // // якщо все ок, то зберігаємо в базу користувача з токеном
    candidate.token = token;
    await candidate.save();

    res.status(200).json({
      code: 200,
      data: {
        email: candidate.email,
        token: candidate.token,
      },
    });
  } catch (error) {
    res.status(res.statusCode);
    res.json({
      code: res.statusCode,
      message: error.message,
    });
  }
});

// авторизація - перевірка  прав доступу
app.patch("/logout", authMiddleware, async (req, res) => {
  try {
    console.log(req.user.id);

    //отримуємо інфо про користувача
    const { id } = req.user;
    const user = await UserModel.findById(id);
    user.token = null;
    await user.save();
    res.status(200).json({
      code: 200,
      data: {
        token: user.token,
      },
      message: "Logout success",
    });
    //скидає йому токен (null)
  } catch (error) {
    res.status(res.statusCode);
    res.json({
      code: res.statusCode,
      message: error.message,
    });
  }
});
// логаут - вихід із системи

function generateToken(data) {
  const payload = { ...data };
  return jwt.sign(payload, "cat", { expiresIn: "8h" });
}

connectDB();
const { PORT } = process.env;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`.green.italic.bold);
});
