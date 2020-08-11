const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

// Validate Function to check e-mail length
let emailLengthChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Check the length of e-mail string
    if (email.length < 5 || email.length > 100) {
      return false; // Return error if not within proper length
    } else {
      return true; // Return as valid e-mail
    }
  }
};

// Validate Function to check if valid e-mail format
let validEmailChecker = (email) => {
  // Check if e-mail exists
  if (!email) {
    return false; // Return error
  } else {
    // Regular expression to test for a valid e-mail
    const regExp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regExp.test(email); // Return regular expression test results (true or false)
  }
};

// Array of Email Validators
const emailValidators = [
  // First Email Validator
  {
    validator: emailLengthChecker,
    message: "E-mail must be at least 5 characters but no more than 30",
  },
  // Second Email Validator
  {
    validator: validEmailChecker,
    message: "Must be a valid e-mail",
  },
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Check password length
    if (password.length < 8 || password.length > 50) {
      return false; // Return error if passord length requirement is not met
    } else {
      return true; // Return password as valid
    }
  }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
  // Check if password exists
  if (!password) {
    return false; // Return error
  } else {
    // Regular Expression to test if password is valid format
    const regExp = new RegExp(
      /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/
    );
    return regExp.test(password); // Return regular expression test result (true or false)
  }
};

// Array of Password validators
const passwordValidators = [
  // First password validator
  {
    validator: passwordLengthChecker,
    message: "Password must be at least 8 characters but no more than 35",
  },
  // Second password validator
  {
    validator: validPassword,
    message:
      "Must have at least one uppercase, lowercase, special character, and number",
  },
];

// User Model Definition
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: emailValidators,
  },
  displayName: { type: String, required: true },
  password: { type: String, required: true },
  thumbnail: { type: String },
  providerId: { type: String },
  phone: { type: Number },
  phone_verified: { type: Boolean },
  credits: { type: Number, default: 0 },
  pin: { type: Number },
  role: {
    subscriber: { type: Boolean },
    author: { type: Boolean },
    admin: { type: Boolean },
  },
  token: { type: String },
  expireDate: { type: Date },
  otp: { type: String },
  email_verified: { type: Boolean },
  date: { type: Date },
});

// Schema Middleware to Encrypt Password
userSchema.pre("save", function (next) {
  var user = this;
  // Ensure password is new or modified before applying encryption
  if (!user.isModified("password")) return next();

  // Apply encryption
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err); // Ensure no errors
    user.password = hash;
    // Apply encryption to password
    next(); // Exit middleware
  });
});

// Methods to compare password to encrypted password upon login
userSchema.methods.comparePassword = function (pwd) {
  var result = bcrypt.compareSync(pwd, this.password);
  if (result) {
    return result;
  } else {
    return false;
  }
};

// Export Module/Schema
module.exports = mongoose.model("User", userSchema);
