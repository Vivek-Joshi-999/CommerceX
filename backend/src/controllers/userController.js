const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt= require("jsonwebtoken")

const registerUser = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword= await bcrypt.hash(password,10)
    console.log("VALUES:", name, email, password);

    const user = await User.create(
     {
      name,
      email,
      password:hashedPassword
     }
    );

   return res.status(201).json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
     return res.status(404).json({
        success: false,
        message: "User Not found",
      });
    }

  return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const user = await User.find();
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
const deleteUser = async(req,res,next)=>{
    try{
        const user = await User.findByIdAndDelete(req.params.id)

        if(!user){
           return res.status(404).json({
                success:false,
                message:"User Not Found"
            })
        }

       return res.status(200).json({
            success:true,
            message:"User deleted successfully"
        
        })
    }

    catch(error){
        next(error);
    }
}

const loginUser =async(req,res,next)=>{
  try{

    const{email,password}=req.body
    
    const user= await User.findOne({email});
    
    if(!user){
     return res.status(401).json({
        success:false,
        message:"Invalid email "
      })
    }
    
    const isMatch= await bcrypt.compare(password,user.password);
    
    if(isMatch){
     return res.status(201).json({
        status:true,
        message:"Login Successful"
      })
    }

const token = jwt.sign({
  userId:user._id,
  role:user.role
},
process.env.JWT_SECRET,
{
    expiresIn: "1d",
  }
)
    return res.status(200).json({
  success: true,
  message: "Login successful",
  token,
});

  return res.status(401).json({
      success:false,
       message: "Invalid email or password",
    })
  }catch(error){
    next(error)
  }

}
module.exports = {
  registerUser,
  getUser,
  updateUser,
  deleteUser,loginUser
};
