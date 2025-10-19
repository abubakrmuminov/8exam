import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useRegister } from "../hooks/useRegister";
import useLogin from "../hooks/useLogin";
import { useGoogle } from "../hooks/useGoogle";
import { toast } from "react-toastify";
import { PasswordResetModal } from "./PasswordResetModal";

export default function AuthForm() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showReset, setShowReset] = useState(false);

  const { register, isPending: registerPending } = useRegister();
  const { login, isPending: loginPending } = useLogin();
  const { googleLogin, isPending: googlePending } = useGoogle();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      if (!username.trim()) {
        toast.error("Username is required");
        return;
      }
      await register(username, email, password, photoURL);
    } else {
      await login(email, password);
    }
  };

  const handleGoogleLogin = async () => {
    await googleLogin();
  };

  const isPending = registerPending || loginPending || googlePending;

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-md border shadow-xl rounded-3xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-2 shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-orange-500/30">
            <span className="text-3xl">🍳</span>
          </div>
          <CardTitle className="text-3xl font-bold">
            Kitchen
          </CardTitle>
          <CardDescription>
            {isSignUp ? "Create your cooking account" : "Welcome back, chef!"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="rounded-xl"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photoURL">Photo URL (optional)</Label>
                  <Input
                    id="photoURL"
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={photoURL}
                    onChange={(e) => setPhotoURL(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="chef@kitchen.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full transition-all shadow-lg rounded-2xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 shadow-orange-500/25 hover:shadow-orange-500/40"
              disabled={isPending}
            >
              {isPending ? "Please wait..." : isSignUp ? "Sign Up" : "Log In"}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-card text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full transition-all rounded-2xl"
            onClick={handleGoogleLogin}
            disabled={isPending}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign in with Google
          </Button>

          <div className="flex flex-col mt-6 space-y-2 text-sm text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-medium text-orange-500 transition-colors hover:text-orange-400"
            >
              {isSignUp
                ? "Already have an account? Log in"
                : "Don't have an account? Sign up"}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="transition-colors text-muted-foreground hover:text-foreground"
              >
                Forgot password?
              </button>
            )}
          </div>

          <PasswordResetModal
            open={showReset}
            onClose={() => setShowReset(false)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
