const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getProducts } = require("./productController");

const registerUser = async (req, res, next) => {
  try {
    console.log("BODY:", req.body);

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("VALUES:", name, email, password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.role;

    if (
      loggedInUserRole !== "admin" &&
      requestedUserId !== loggedInUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own account",
      });
    }

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      requestedUserId,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
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
const deleteUser = async (req, res, next) => {
  try {
    const requestedUserId = req.params.id;
    const loggedInUserId = req.user.userId;
    const loggedInUserRole = req.user.role;

    if (
      loggedInUserRole !== "admin" &&
      requestedUserId !== loggedInUserId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own account",
      });
    }

    const user = await User.findByIdAndDelete(requestedUserId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};



  
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

module.exports = {
  registerUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  getProfile,
};
