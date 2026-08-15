const express= require("express");

const{
    registerUser,
    getUser,
    updateUser,
    deleteUser,loginUser
}=require("../controllers/userController");

const router=express.Router();

router.post("/register",registerUser);
router.get("/",getUser);
router.put("/:id",updateUser);
router.delete("/:id",deleteUser);
router.post("/login", loginUser);

module.exports=router;