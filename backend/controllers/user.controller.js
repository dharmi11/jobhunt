import User from "../models/user.model.js"; // Correct default import
import UserActivation from "../models/UserActivation.model.js"; // Correct default import
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";


// Register a new user
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    console.log(fullname, email, phoneNumber, password, role);

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
    });
  //   await User.create({
  //     fullname,
  //     email,
  //     phoneNumber,
  //     password:hashedPassword ,
  //     role,
  //     profile
  // });
    // Generate an activation code (dummy example)
    const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Store activation details in UserActivation collection
    await UserActivation.create({
      email,
      activationCode,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000), // Expires in 10 minutes
    });

    return res.status(201).json({
      message: "Account created successfully. Please activate your account.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    // Convert both role values to lowercase for comparison
    if (role.toLowerCase() !== user.role.toLowerCase()) {
      return res.status(400).json({
        message: "Account doesn't exist with the current role",
        success: false,
      });
    }

    const tokenData = { userId: user._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "strict" })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};


// Update profile function
export const updateProfile = async (req, res) => {
  try {
      const { fullname, email, phoneNumber, bio, skills } = req.body;
      
      const file = req.file;
      // // cloudinary ayega idhar
      // const fileUri = getDataUri(file);
      // const cloudResponse = await cloudinary.uploader.upload(fileUri.content);



      let skillsArray;
      if(skills){
          skillsArray = skills.split(",");
      }
      const userId = req.id; // middleware authentication
      let user = await User.findById(userId);

      if (!user) {
          return res.status(400).json({
              message: "User not found.",
              success: false
          })
      }
      // updating data
      if(fullname) user.fullname = fullname
      if(email) user.email = email
      if(phoneNumber)  user.phoneNumber = phoneNumber
      if(bio) user.profile.bio = bio
      if(skills) user.profile.skills = skillsArray
    
      // resume comes later here...
      // if(cloudResponse){
      //     user.profile.resume = cloudResponse.secure_url // save the cloudinary url
      //     user.profile.resumeOriginalName = file.originalname // Save the original file name
      // }


      await user.save();

      user = {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
      }

      return res.status(200).json({
          message:"Profile updated successfully.",
          user,
          success:true
      })
  } catch (error) {
      console.log(error);
  }
};
// / Logout function
export const logout = async (req, res) => {
  try {
      return res.status(200).cookie("token", "", { maxAge: 0 }).json({
          message: "Logged out successfully.",
          success: true
      })
  } catch (error) {
      console.log(error);
  }
}