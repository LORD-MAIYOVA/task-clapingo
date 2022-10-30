const { model } = require('mongoose');
const Teacher = require('../models/teacherModel');
const bcrypt = require('bcrypt') ; 

const teacherController = {
   register : async(req , res)=>{
     try {
        const{email , name} = req.body ; 
       
        const teacher = await Teacher.findOne({email}) ; 
        
        if(teacher) res.status(400).json({msg : "Teacher Alreday register"}); 
        
       
        const newTeacher  = new Teacher({
          name,
          email,
        });
        // save to mongo
        await newTeacher.save();
        
        res.status(200).json({msg : "Teacher registerd"}) ; 


     } catch (error) {
        res.status(500).json({msg : error.message})
     }
   }
}

module.exports = teacherController ; 