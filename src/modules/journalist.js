// Shcemas
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const validator = require("validator");
const Np = require("./np");

const journalistShcema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isMobilePhone(value.toString(), "ar-EG")) {
        throw new Error("Phone is invalid");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password is weak");
      }
    },
  },
  image: {
    type: Buffer,
  },
});

journalistShcema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcryptjs.hash(this.password, 8);
  }
});
journalistShcema.pre("remove", async function (next) {
  const journalist = this;
  await Np.deleteMany({ publisher: journalist._id });
  next();
});

//create token
journalistShcema.methods.generateToken = function () {
  const token = jwt.sign({ _id: this._id.toString() }, "nodeAPI");
  return token;
};

journalistShcema.statics.findByCredentials = async (email, password) => {
  const journalist = await Journalist.findOne({ email });

  if (!journalist) {
    throw new Error("Please check email or password");
  }
  const isMatch = await bcryptjs.compare(password, journalist.password);
  if (!isMatch) {
    throw new Error("Please check email or password");
  }
  return journalist;
};

const Journalist = mongoose.model("Journalist", journalistShcema);

module.exports = Journalist;
