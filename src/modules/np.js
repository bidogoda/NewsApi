const mongoose = require("mongoose");

const npShcema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 4,
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
  },
  publisher: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Journalist",
  },
  image: {
    type: Buffer,
  },
  createdAt:{
    type:String
  }
});

const Np = mongoose.model("Np", npShcema);
module.exports = Np;
