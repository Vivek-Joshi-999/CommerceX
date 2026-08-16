const express= require("express");

const{
    registerUser,
    getUser,
    updateUser,
    deleteUser,loginUser,getProfile
}=require("../controllers/userController");

const authMiddleware=require("../middleware/authMiddleware")
const authorizeRoles= require("../middleware/roleMiddlware")

const router=express.Router();

router.post("/register",registerUser);
router.get("/", authMiddleware, getUser);
router.get("/profile", authMiddleware, getProfile);
router.put(
  "/:id",
  authMiddleware,
  updateUser
);
router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  deleteUser
);
router.post("/login", loginUser);

module.exports=router;