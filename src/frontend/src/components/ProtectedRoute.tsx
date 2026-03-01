import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="min-h-screen navy-gradient flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-[oklch(var(--saffron))]" />
          <p className="font-body text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen navy-gradient flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <h1 className="font-display font-bold text-2xl mb-3">
            Login Required
          </h1>
          <p className="font-body text-white/70 text-sm mb-6">
            Please login with Internet Identity to access the admin panel.
          </p>
          <Link to="/admin/login">
            <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.12_0.02_260)] hover:bg-[oklch(0.65_0.16_65)]">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
