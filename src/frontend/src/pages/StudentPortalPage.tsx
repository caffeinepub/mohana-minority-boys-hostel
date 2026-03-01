import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  LogIn,
  Phone,
  UserPlus,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useLoginApplicant, useRegisterApplicant } from "../hooks/useQueries";

export default function StudentPortalPage() {
  const navigate = useNavigate();
  const register = useRegisterApplicant();
  const login = useLoginApplicant();

  const [activeTab, setActiveTab] = useState<"register" | "login">("register");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [showLoginPin, setShowLoginPin] = useState(false);
  const [error, setError] = useState("");

  // Register form
  const [regName, setRegName] = useState("");
  const [regMobile, setRegMobile] = useState("");
  const [regPin, setRegPin] = useState("");
  const [regConfirmPin, setRegConfirmPin] = useState("");

  // Login form
  const [loginMobile, setLoginMobile] = useState("");
  const [loginPin, setLoginPin] = useState("");

  const validateMobile = (mobile: string) => /^[6-9]\d{9}$/.test(mobile.trim());

  const validatePin = (pin: string) => /^\d{4,6}$/.test(pin);

  const handleRegister = async () => {
    setError("");
    const name = regName.trim();
    const mobile = regMobile.trim();

    if (!name) return setError("Full name is required");
    if (!validateMobile(mobile))
      return setError("Enter a valid 10-digit mobile number starting with 6-9");
    if (!validatePin(regPin)) return setError("PIN must be 4-6 digits");
    if (regPin !== regConfirmPin) return setError("PINs do not match");

    try {
      await register.mutateAsync({ mobile, pin: regPin, name });
      toast.success("Registration successful! Please login to continue.");
      setActiveTab("login");
      setLoginMobile(mobile);
      // Reset form
      setRegName("");
      setRegMobile("");
      setRegPin("");
      setRegConfirmPin("");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Registration failed";
      setError(msg);
    }
  };

  const handleLogin = async () => {
    setError("");
    const mobile = loginMobile.trim();

    if (!validateMobile(mobile))
      return setError("Enter a valid 10-digit mobile number");
    if (!loginPin) return setError("PIN is required");

    try {
      await login.mutateAsync({ mobile, pin: loginPin });
      localStorage.setItem("applicantMobile", mobile);
      localStorage.setItem("applicantPin", loginPin);
      toast.success("Login successful!");
      navigate({ to: "/admission/status" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Invalid mobile or PIN";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="navy-gradient py-16 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[oklch(var(--saffron)/0.2)] border border-[oklch(var(--saffron)/0.4)] mb-5">
            <GraduationCap className="w-8 h-8 text-[oklch(var(--saffron))]" />
          </div>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-3">
            Student Admission Portal
          </h1>
          <p className="text-white/70 font-body text-sm max-w-md mx-auto">
            Register with your mobile number and apply for hostel admission at
            Post Matric Minority Boys Hostel, Mohana.
          </p>
        </motion.div>
      </section>

      {/* Form Card */}
      <section className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
            <Tabs
              value={activeTab}
              onValueChange={(v) => {
                setActiveTab(v as "register" | "login");
                setError("");
              }}
            >
              <TabsList className="grid grid-cols-2 w-full rounded-none border-b border-border h-12 bg-muted/50">
                <TabsTrigger
                  value="register"
                  className="rounded-none font-body text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  <UserPlus className="w-4 h-4 mr-1.5" />
                  Register
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-none font-body text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
                >
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Login
                </TabsTrigger>
              </TabsList>

              {/* Register */}
              <TabsContent value="register" className="p-6 space-y-4 mt-0">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Create Account
                  </h2>
                  <p className="text-muted-foreground text-sm font-body mt-1">
                    Register with your mobile number to apply for admission.
                  </p>
                </div>

                {error && activeTab === "register" && (
                  <Alert className="border-destructive/40 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive text-sm font-body">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Full Name *</Label>
                  <Input
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Mohammed Arif Khan"
                    className="font-body text-sm"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={regMobile}
                      onChange={(e) =>
                        setRegMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="9876543210"
                      className="font-body text-sm pl-9"
                      autoComplete="tel"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground font-body">
                    10-digit mobile number. This will be your login ID.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Create PIN *</Label>
                  <div className="relative">
                    <Input
                      type={showPin ? "text" : "password"}
                      inputMode="numeric"
                      value={regPin}
                      onChange={(e) =>
                        setRegPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                      }
                      placeholder="4-6 digit PIN"
                      className="font-body text-sm pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Confirm PIN *</Label>
                  <div className="relative">
                    <Input
                      type={showConfirmPin ? "text" : "password"}
                      inputMode="numeric"
                      value={regConfirmPin}
                      onChange={(e) =>
                        setRegConfirmPin(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="Re-enter PIN"
                      className="font-body text-sm pr-10"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={register.isPending}
                  className="w-full bg-primary text-primary-foreground font-body font-semibold mt-2"
                >
                  {register.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registering...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Register
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground font-body">
                  Already registered?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => {
                      setActiveTab("login");
                      setError("");
                    }}
                  >
                    Login here
                  </button>
                </p>
              </TabsContent>

              {/* Login */}
              <TabsContent value="login" className="p-6 space-y-4 mt-0">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Login
                  </h2>
                  <p className="text-muted-foreground text-sm font-body mt-1">
                    Enter your mobile number and PIN to access your application.
                  </p>
                </div>

                {error && activeTab === "login" && (
                  <Alert className="border-destructive/40 bg-destructive/5">
                    <AlertCircle className="h-4 w-4 text-destructive" />
                    <AlertDescription className="text-destructive text-sm font-body">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Mobile Number *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      inputMode="numeric"
                      value={loginMobile}
                      onChange={(e) =>
                        setLoginMobile(
                          e.target.value.replace(/\D/g, "").slice(0, 10),
                        )
                      }
                      placeholder="9876543210"
                      className="font-body text-sm pl-9"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">PIN *</Label>
                  <div className="relative">
                    <Input
                      type={showLoginPin ? "text" : "password"}
                      inputMode="numeric"
                      value={loginPin}
                      onChange={(e) =>
                        setLoginPin(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="Your 4-6 digit PIN"
                      className="font-body text-sm pr-10"
                      autoComplete="current-password"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleLogin();
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPin(!showLoginPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showLoginPin ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleLogin}
                  disabled={login.isPending}
                  className="w-full bg-primary text-primary-foreground font-body font-semibold mt-2"
                >
                  {login.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Login & Continue
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-muted-foreground font-body">
                  New applicant?{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline font-medium"
                    onClick={() => {
                      setActiveTab("register");
                      setError("");
                    }}
                  >
                    Register here
                  </button>
                </p>
              </TabsContent>
            </Tabs>
          </div>

          {/* Info note */}
          <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground font-body leading-relaxed">
              <span className="font-semibold text-foreground">Note:</span> Your
              mobile number acts as your unique login ID. Keep your PIN secure.
              After login, you can fill and submit the admission application
              form.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
