const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const paymentSchema = new Schema({
  order: { type: String },
  amount: { type: Number, required: true },
  capture: { type: Boolean, required: true },
  receipt: { type: String },
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  raz_payment_id: { type: String },
  raz_status: { type: String },
  data: { type: JSON },
  mode: { type: Boolean, default: false },
  expireDate: { type: Date },
  created_at: { type: Date, required: true },
});
module.exports = mongoose.model("Payment", paymentSchema);
