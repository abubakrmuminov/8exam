import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { toast } from "react-toastify";

export const useResetPassword = () => {
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Check your email! Password reset link sent.");
    } catch (error) {
      const errorMessage = error.message || "Failed to send reset email";
      toast.error(errorMessage);
      console.error("Reset password error:", errorMessage);
    }
  };

  return { resetPassword };
};
