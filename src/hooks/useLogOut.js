import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; 
import { toast } from "react-toastify";
import { auth, db } from "../firebase/config";
import { logout as logoutAction } from "../app/Auth/AuthSlice";

let activeUnsubscribes = [];

export const registerFirestoreUnsubscribe = (fn) => {
  activeUnsubscribes.push(fn);
};

const cleanupFirestoreListeners = () => {
  activeUnsubscribes.forEach((unsub) => unsub());
  activeUnsubscribes = [];
};

export function useLogOut() {
  const user = useSelector((store) => store.auth.user);
  const dispatch = useDispatch();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setIsPending(true);
    setError(null);

    try {
      cleanupFirestoreListeners();

      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(
          userRef,
          {
            online: false,
            lastLogout: new Date(),
          },
          { merge: true } 
        );
      }

      await signOut(auth);

      dispatch(logoutAction());

      toast.success("Successfully logged out");
    } catch (err) {
      console.error("Logout error:", err.message);
      setError(err.message);
      toast.error(`Logout failed: ${err.message}`);
    } finally {
      setIsPending(false);
    }
  };

  return { logout: handleLogout, isPending, error };
}
