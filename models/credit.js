const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const creditSchema = new Schema({
  credit: { type: Number, required: true },
  amount: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  publisher: { type: Schema.Types.ObjectId, ref: "Publisher" },
  article: { type: Schema.Types.ObjectId, ref: "Article" },
  raz_payment_id: String,
  raz_order_id: String,
  raz_status: String,
  pub_amount: { type: Number },
  capture: { type: Boolean, default: false },
  created_at: { type: Date, required: true },
  bank: { type: Boolean, default: false },
});

module.exports = mongoose.model("Credit", creditSchema);
