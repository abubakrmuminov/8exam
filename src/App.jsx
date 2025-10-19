import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "./firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { login, logout } from "./app/Auth/AuthSlice";
import AuthForm from "./components/AuthForm";
import Dashboard from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          login({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          })
        );
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <>
      {isAuthenticated ? <Dashboard /> : <AuthForm />}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Toaster />
    </>
  );
}

export default App;
