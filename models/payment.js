const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  order: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  capture: { type: Boolean, required: true },
  receipt: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  raz_payment_id: { type: String },
  raz_status: { type: String },
  data: { type: JSON },
  created_at: { type: Date, required: true },
});
module.exports = mongoose.model("Payment", paymentSchema);
