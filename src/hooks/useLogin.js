  import { signInWithEmailAndPassword } from "firebase/auth";
  import { useState } from "react";
  import { useDispatch } from "react-redux";
  import { toast } from "react-toastify";
  import { auth, db } from "../firebase/config";
  import { login as loginAction } from "../app/Auth/AuthSlice";
  import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";



  export default function useLogin() {
    const dispatch = useDispatch();

    const [isPending, setIspending] = useState(false);
    const [error, setError] = useState(null);

    const login = async (email, password) => {
      try {
        setIspending(true);
        setError(null);

        const req = await signInWithEmailAndPassword(auth, email, password);

        if (!req.user) {
          toast.error("Login failed");
          return;
        }

        const userRef = doc(db, "users", req.user.uid);

        const snap = await getDoc(userRef);
        if (!snap.exists()) {
          await setDoc(userRef, {
            uid: req.user.uid,
            email: req.user.email,
            displayName: req.user.displayName || "No Name",
            photoURL: req.user.photoURL || "/default-avatar.png",
            online: true,
          });
        } else {
          await updateDoc(userRef, { online: true });
        }

        dispatch(
          loginAction({
            uid: req.user.uid,
            email: req.user.email,
            displayName: req.user.displayName || "No Name",
            photoURL: req.user.photoURL || "/default-avatar.png",
          })
        );

        console.log("User:", req.user);
        toast.success("Login successful ✅");
      } catch (error) {
        setError(error.message);
        console.log("Firebase error:", error.message);
        toast.error(error.message);
      } finally {
        setIspending(false);
      }
    };

    return { login, error, isPending };
  }