import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../app/Auth/AuthSlice";
import { auth, db } from "../firebase/config";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Moon, Sun } from "lucide-react";
import RecipeForm from "./RecipeForm";
import RecipesList from "./RecipesList";
import { toast } from "react-toastify";
import { useLogOut } from "../hooks/useLogOut";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const { logout, isPending } = useLogOut();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      if (user?.uid) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { online: false });
      }
      await signOut(auth);
      dispatch(logoutAction());
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen p-6 transition-colors duration-300 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="p-6 mb-8 border shadow-lg bg-card backdrop-blur-xl border-border rounded-3xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-2 shadow-lg border-orange-500/30 shadow-orange-500/20">
                <AvatarImage
                  src={user?.photoURL || user?.photoUrl}
                  alt={user?.displayName}
                />
                <AvatarFallback className="text-xl text-white bg-gradient-to-br from-orange-500 to-amber-600">
                  {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Welcome, {user?.displayName || "Chef"}!
                </h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="transition-all rounded-2xl"
                size="icon"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </Button>
              <Button
                onClick={() => setShowRecipeForm(true)}
                className="transition-all shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25 hover:shadow-orange-500/40"
              >
                Create Recipe
              </Button>

              <Button
                onClick={logout}
                variant="outline"
                className="transition-all rounded-2xl hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                disabled={isPending}
              >
                {isPending ? "Logging out..." : "Logout"}
              </Button>
            </div>
          </div>
        </div>

        <RecipesList />
      </div>

      {showRecipeForm && (
        <RecipeForm onClose={() => setShowRecipeForm(false)} />
      )}
    </div>
  );
}
