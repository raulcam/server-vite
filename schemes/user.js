import mongoose from "mongoose";

export const User = new mongoose.Schema({
  id: String,
  name: String,
  username: String,
  password: String,
  phone: String,
  email: String,
  isUser: Boolean,
  createAt: String,
  updateAt: String,
});
