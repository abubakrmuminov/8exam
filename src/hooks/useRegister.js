import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../firebase/config";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { login } from "../app/Auth/AuthSlice";
import { doc, setDoc } from "firebase/firestore";

export const useRegister = () => {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const register = async (
    name,
    email,
    password,
    photoURL
  ) => {
    try {
      setIsPending(true);
      setError(null);

      const req = await createUserWithEmailAndPassword(auth, email, password);

      if (!req.user) {
        toast.error("Registration failed");
        return;
      }

      const finalPhoto =
        photoURL?.trim() ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${req.user.uid}`;

      await updateProfile(req.user, {
        displayName: name,
        photoURL: finalPhoto,
      });

      await setDoc(doc(db, "users", req.user.uid), {
        uid: req.user.uid,
        displayName: req.user.displayName || name,
        photoURL: finalPhoto,
        email: req.user.email,
        online: true,
      });

      dispatch(login(req.user));

      toast.success("Registration successful ✅");
    } catch (error) {
      console.error("Firebase register error:", error.message);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setIsPending(false);
    }
  };

  return { register, isPending, error };
};
