import mongoose from "mongoose";

const userActivationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  activationCode: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

const UserActivation = mongoose.model("UserActivation", userActivationSchema);
export default UserActivation; // Exporting UserActivation as default
