const { app } = require("./server");

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
    // const candidate = await UserModel.findOne({ email });
    // //якщо не знайшли або не розшифрували пароль, видаємо помилку
    // if (candidate) {
    //   res.status(400);
    //   throw new Error("User already exists");
    // }
    // //якщо знайшли і розшифрували пароль, то видаємо токен
    // const hashPassword = bcrypt.hashSync(password, 5);
    // // якщо все ок, то зберігаємо в базу користувача з токеном
    // const user = await UserModel.create({
    //   ...req.body,
    // });
    // res.status(201).json({
    //   code: 200,
    //   data: {
    //     email: user.email,
    //   },
    // });
  } catch (error) {
    res.status(res.statusCode);
    res.json({
      code: res.statusCode,
      message: error.message,
    });
  }
});
