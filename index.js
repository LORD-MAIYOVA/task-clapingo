require('dotenv').config();
 const express = require('express');
 const mongoose = require('mongoose');
 const cors = require('cors');




 const app = express();
 app.use(express.json())
 app.use(cors())
 


// routes

 app.use('/user' , require('./routes/studentRoutes'));
 app.use('/user/teacher' , require('./routes/teacherRoutes'));



 // connect to mongoDb
 const URL = process.env.MONGO_URL

 mongoose.connect(URL, {
         useNewUrlParser: true,
         useUnifiedTopology: true
     }, err => {
         if (err) throw err;
         console.log("connected to mongodb");
     }

 )



 //  connect to port
 const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
     console.log(`server running on port${PORT}`);
 })