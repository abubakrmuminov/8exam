import { useState } from "react";
import { auth, db } from "../firebase/config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { login } from "../app/Auth/AuthSlice";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

export const useGoogle = () => {
  const dispatch = useDispatch();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setIsPending(true);
    setError(null);

    try {
      const result = await signInWithPopup(auth, provider);

      if (!result.user) throw new Error("Google login failed");

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);
      const photoURL =
        result.user.photoURL ||
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${result.user.uid}`;

      if (!userSnap.exists()) {
        const newUser = {
          displayName: result.user.displayName || "No Name",
          email: result.user.email || "no-email@example.com",
          photoURL,
          uid: result.user.uid,
          createdAt: serverTimestamp(),
        };
        await setDoc(userRef, newUser);
      } else {
        await setDoc(userRef, { online: true }, { merge: true });
      }

      dispatch(
        login({
          displayName: result.user.displayName || "No Name",
          email: result.user.email || "no-email@example.com",
          photoURL,
          uid: result.user.uid,
        })
      );
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { googleLogin, isPending, error };
};
