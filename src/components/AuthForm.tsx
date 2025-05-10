
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup" | "reset";

export function AuthForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        navigate("/");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
            },
          },
        });
        
        if (error) throw error;
        
        setMessage("Please check your email for a verification link.");
        toast({
          title: "Registration successful",
          description: "Please check your email to verify your account.",
        });
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        
        if (error) throw error;
        
        setMessage("Password reset instructions sent to your email.");
        toast({
          title: "Reset email sent",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      toast({
        title: "Authentication error",
        description: err.message || "An error occurred during authentication.",
        variant: "destructive",
      });
      setMessage(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md p-6 shadow-lg border-border/40 bg-card/90 backdrop-blur-sm">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          {mode === "login" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Reset Password"}
        </h2>
        <p className="text-muted-foreground">
          {mode === "login"
            ? "Sign in to access your tasks"
            : mode === "signup"
            ? "Sign up to start organizing your tasks"
            : "Enter your email to reset your password"}
        </p>
      </div>

      {message && (
        <div className="p-3 mb-4 bg-secondary text-secondary-foreground rounded-md text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10"
            />
          </div>
        </div>

        {mode !== "reset" && (
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
                minLength={6}
              />
            </div>
          </div>
        )}

        {mode === "signup" && (
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full" />
              {mode === "login" ? "Signing In..." : mode === "signup" ? "Signing Up..." : "Sending..."}
            </span>
          ) : (
            <span className="flex items-center justify-center">
              {mode === "login" ? "Sign In" : mode === "signup" ? "Sign Up" : "Send Reset Link"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        {mode === "login" ? (
          <>
            <button
              onClick={() => setMode("reset")}
              className="text-primary hover:underline mr-1"
            >
              Forgot password?
            </button>
            {" · "}
            <button
              onClick={() => setMode("signup")}
              className="text-primary hover:underline ml-1"
            >
              Create an account
            </button>
          </>
        ) : (
          <button
            onClick={() => setMode("login")}
            className="text-primary hover:underline"
          >
            Already have an account? Sign in
          </button>
        )}
      </div>
    </Card>
  );
}
