import bcryptjs from "bcryptjs";
import User from "../models/user.js";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinaryConfig.js";
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be atleast 8 characters" });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Something is Wrong with User Data" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All Fields are Required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }
    generateToken(user._id, res);
    res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "User Logged Out Successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    let url = req.file.path;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: url },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(400).json({ message: "Something is Wrong" });
    }
    res.status(200).json({
      message: "User Profile Updated Successfully",
      updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const isAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
