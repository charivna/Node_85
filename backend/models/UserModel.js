const { model, Schema } = require("mongoose");
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    default: "Kate",
  },
  token: {
    type: String,
    default: null,
  },
});
module.exports = model("user", userSchema);
