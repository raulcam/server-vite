import mongoose, { mongo } from "mongoose";

const userShema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    enum: ["operador", "estratega", "gerente", "coordinador"],
  },
});


export default mongoose.model('User', userShema);