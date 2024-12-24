import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../utils/cloudinary.js";
import { generateVerificationCode } from "../utils/generateOtp.js";
import { generateToken } from "../utils/generateToken.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../email/email.js";
export const signup = async(req, res)=>{
    try {
        const {fullName, email, password, contact}= req.body;
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({success:false,message: "User already exists with the same email"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateVerificationCode()
        user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            contact:Number(contact),
            verificationToken,
            verificationTokenExpiresAt:Date.now()+24*60*60*1000
        })
        generateToken(res, user);
        await sendVerificationEmail(email, verificationToken)
        return res.status(201).json({success:true,message: "Account created successfully", user:user.select("-password")});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:error})
    }
}

export const login = async(req, res)=>{
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({success:false,message: "Invalid email or password"});
        }
        generateToken(res, user);
        user.lastLogin = new Date();
        await user.save();
        return res.status(200).json({success:true,message: `Welcome back ${user.fullName}`, user:user.select("-password")});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const verifyEmail = async(req, res)=>{
    try {
        const {verificationCode} = req.body;
        const user = await User.findOne({verificationToken: verificationCode, verificationTokenExpiresAt:{$gt:Date.now()}}).select("-password");
        if(!user){
            return res.status(400).json({success:false,message: "Invalid or expired  verification token"})
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        await sendWelcomeEmail(user.email, user.fullName);
        return res.status(200).json({success:true,message: `Email verified successfully ${user.fullName}`});
    } catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const logout = async(req, res)=>{
    try {
        return res.clearCookie("token").status(200).json({success:true}, {message:"user logged out successfully"});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const forgotPassword = async(req, res)=>{
    try {
        const {email} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success:false,message: "User with this email doesn't exist"});
        }
        const resetToken = crypto.randomBytes(40).toString('hex')
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = new Date(Date.now()+60*60*1000)
        // await sendForgotPasswordEmail(user.email, user.fullName, resetToken);
        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`)
        return res.status(200).json({success:true,message: `Password reset link sent to your email`});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"Internal Server Error"})
    }
}

export const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      if (!resetToken || !newPassword) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request, missing fields" });
      }
  
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpiresAt: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiresAt = undefined;
      await user.save();
      await sendResetSuccessEmail(user.email)
      return res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset Password Error:", error.message);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

export const checkAuth = async(req, res)=>{
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({success:false,message:"User not found"})
        }
        return res.status(200).json({success:true, user});
    } catch (error) {
        console.error("User Unauthorized:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.id;
        const {fullName, email, address, city, country, profilePicture} = req.body;
        let cloudResponse = await cloudinary.uploader.upload(profilePicture);
        const updatedData={fullName, email, address, city, country, profilePicture};
        const user = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");
        return res.status(200).json({success:true, user, message:"User Updated Successfully"});
    }catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server Error"})
    }
} 