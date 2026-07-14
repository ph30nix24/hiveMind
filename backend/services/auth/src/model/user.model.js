import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Only required for email/password signups
    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false, // never return password by default in queries
    },
    authProvider: {
      type: String,
      enum: ["local", "firebase"],
      required: true,
      default: "local",
    },
    // Only present for Firebase-authenticated users
    firebaseUID: {
      type: String,
      unique: true,
      sparse: true, // allows multiple docs with no firebaseUID without violating uniqueness
    },
    isVerified: {
      type: Boolean,
      default: false, // local users verify via email link; firebase users can default true
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);


const User = mongoose.model("user", userSchema);
export default User;