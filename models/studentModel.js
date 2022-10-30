const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true,
    min: 5,
  },
  favTeacher : {
    type: Array,
  
    default : []
  }
  
});

module.exports = mongoose.model("Students", studentSchema);
