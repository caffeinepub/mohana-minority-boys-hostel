import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Info, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const {
    login,
    identity,
    isLoggingIn,
    isLoginError,
    loginError,
    isInitializing,
  } = useInternetIdentity();

  // Redirect any logged-in user to admin panel
  useEffect(() => {
    if (identity) {
      toast.success("Welcome to Admin Panel!");
      void navigate({ to: "/admin" });
    }
  }, [identity, navigate]);

  const handleLogin = () => {
    login();
  };

  const isLoading = isInitializing;

  return (
    <div className="min-h-screen hero-pattern flex items-center justify-center p-4">
      {/* Back to site */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-body"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Website
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-[oklch(var(--saffron))] flex items-center justify-center mx-auto mb-4 overflow-hidden">
            <img
              src="/assets/generated/odisha-emblem-transparent.png"
              alt="Odisha Emblem"
              className="w-18 h-18 object-cover"
            />
          </div>
          <h1 className="font-display font-bold text-2xl text-white mb-1">
            Admin Portal
          </h1>
          <p className="text-white/60 font-body text-sm">
            Post Matric Minority Boys Hostel, Mohana
          </p>
        </div>

        <Card className="border-border/50 bg-white/95 backdrop-blur shadow-2xl">
          <CardHeader className="text-center pb-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="font-display text-xl">
              Administrator Login
            </CardTitle>
            <CardDescription className="font-body text-sm">
              Sign in with Internet Identity to access the admin panel
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Error Alert */}
            {isLoginError && loginError && (
              <Alert className="border-destructive/50 bg-destructive/5">
                <AlertDescription className="font-body text-sm text-destructive">
                  {loginError.message}
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="font-body text-sm text-muted-foreground">
                  Initializing...
                </span>
              </div>
            )}

            {/* Redirecting after login */}
            {identity && (
              <div className="flex items-center justify-center gap-2 py-4">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span className="font-body text-sm text-muted-foreground">
                  Redirecting to admin panel...
                </span>
              </div>
            )}

            {/* Login Button */}
            {!identity && !isLoading && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-display font-semibold text-sm text-foreground mb-2">
                    Internet Identity Login
                  </h3>
                  <p className="text-muted-foreground text-xs font-body leading-relaxed">
                    This portal uses{" "}
                    <strong className="text-foreground">
                      Internet Identity
                    </strong>{" "}
                    — a secure, password-free authentication system by the
                    Internet Computer Protocol. No username or password needed.
                  </p>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-body font-semibold py-3"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opening Internet Identity...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login with Internet Identity
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Info */}
            <Alert className="border-border bg-muted/50">
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              <AlertDescription className="font-body text-xs text-muted-foreground">
                Any user with an Internet Identity account can log in and access
                the admin panel.
              </AlertDescription>
            </Alert>

            {/* Note */}
            <div className="text-center pt-2 border-t border-border">
              <Badge
                variant="outline"
                className="font-body text-xs text-muted-foreground border-border"
              >
                Login with Internet Identity to get started
              </Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
