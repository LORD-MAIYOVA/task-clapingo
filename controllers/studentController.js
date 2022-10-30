
const Students = require("../models/studentModel");
const Teacher = require("../models/teacherModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const studentController = {
  register: async (req, res) => {
    try {
      const { email, name, password } = req.body;

      const student = await Students.findOne({ email });

      if (student) res.status(400).json({ msg: "Student Alreday register" });
      if (password.length < 5)
        res
          .status(400)
          .json({ msg: "Password length should be atleast 5 character" });

      const hashPassword = await bcrypt.hash(password, 10);
      const newStudent = new Students({
        name,
        email,
        password: hashPassword,
      });
      // save to mongo
      await newStudent.save();

      const accessToken = createAccessToken({
        id: newStudent._id,
      });

      const refreshToken = createRefreshToken({
        id: newStudent._id,
      });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.status(200).json({ msg: "student registerd" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  refreshToken: async (req, res) => {
    try {
      console.log(req);
      const rft = req.cookies.refreshtoken;

      if (!rft)
        return res.status(400).json({
          msg: "plz login or register",
        });

      jwt.verify(rft, process.env.REFRESH_TOKEN, (err, user) => {
        if (err)
          return res.status(400).json({
            msg: "plz login or register",
          });

        const accesstoken = createAccessToken({
          id: user.id,
        });

        res.json({
          accesstoken,
        });
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const student = await Students.findOne({ email });
      if (!student) return res.status(400).json("user not there ");
      if (!bcrypt.compare(password, student.password))
        return res.status(400).json("password in wrong ");

      // create accesstoken

      const accessToken = createAccessToken({
        id: student._id,
      });
      const refreshToken = createRefreshToken({
        id: student._id,
      });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refreshtoken",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
      });

      res.json(accessToken);
      // res.send("login suucessful");
    } catch (error) {
      return res.status(500).json(error.message);
    }
  },

  addfavTeacher: async (req, res) => {
    try {
      const student_id = req.user.id ; 
      const { teacher_id } = req.body;

      const student = await Students.findById(student_id);
      if (!student) res.status(400).json({ msg: "No student found " });

      const teacher = await Teacher.findById(teacher_id);
      if (!teacher) res.status(400).json({ msg: "No teacher found " });

      let arr = student.favTeacher;
      arr.push(teacher);

      let c = teacher.count;
      c = c + 1;
      await Teacher.findByIdAndUpdate(teacher_id, { count: c });
      await Students.findByIdAndUpdate(student_id, { favTeacher: arr });
      res.status(200).json({ msg: "fav teacher added" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  removefavTeacher: async (req, res) => {
    try {

      const student_id = req.user.id ; 
      const { teacher_id } = req.body;

      const student = await Students.findById(student_id);
      if (!student) res.status(400).json({ msg: "No student found " });

      const teacher = await Teacher.findById(teacher_id);
      if (!teacher) res.status(400).json({ msg: "No teacher found " });

      let arr = student.favTeacher;

      arr = arr.filter((item) => item.email !== teacher.email);

      let c = teacher.count;
      c = c - 1;
      await Teacher.findByIdAndUpdate(teacher_id, { count: c });
      await Students.findByIdAndUpdate(student_id, { favTeacher: arr });
      res.status(200).json({ msg: "fav teacher removed" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  mostfavTeacher: async (req, res) => {
    try {
      //  const teacher = await Teacher.find().sort({count : -1}).limit(1) ;
      //  res.status(200).send(teacher) ;

      const arr = await Teacher.aggregate([
        {
          $group: {
            maxCount: { $min: "$count" },
            _id: "$name",
          },
        },
      ]);

      res.status(200).send(arr);
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

const createAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN, {
    expiresIn: "11m",
  });
};
const createRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN, {
    expiresIn: "7d",
  });
};
module.exports = studentController;
