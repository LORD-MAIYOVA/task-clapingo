const mongoose = require("mongoose");
const teacherSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Teachers", teacherSchema);
