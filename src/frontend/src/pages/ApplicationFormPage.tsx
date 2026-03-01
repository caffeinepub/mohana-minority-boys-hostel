import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Loader2,
  MapPin,
  Upload,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { AdmissionApplication } from "../backend.d";
import { ApplicationStatus } from "../backend.d";
import { useSubmitApplication } from "../hooks/useQueries";
import { useStorageUpload } from "../hooks/useStorageUpload";

const CATEGORIES = [
  "Muslim",
  "Christian",
  "Sikh",
  "Buddhist",
  "Zoroastrian",
  "Jain",
];

const STEPS = [
  { label: "Personal Details", icon: User },
  { label: "Address & Education", icon: MapPin },
  { label: "Documents", icon: FileText },
];

interface FormData {
  applicantName: string;
  fatherName: string;
  dateOfBirth: string;
  applicantMobile: string;
  category: string;
  annualIncome: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
  institutionName: string;
  classYear: string;
  photoUrl: string;
  incomeCertUrl: string;
  casteCertUrl: string;
}

function FileUploadField({
  label,
  hint,
  value,
  onChange,
  accept,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
}) {
  const { uploadFile, uploading, progress } = useStorageUpload();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleFile = async (file: File) => {
    setFileName(file.name);
    const url = await uploadFile(file);
    if (url) {
      onChange(url);
      toast.success(`${label} uploaded`);
    } else {
      toast.error(`Failed to upload ${label}`);
      setFileName("");
    }
  };

  return (
    <div className="space-y-2">
      <Label className="font-body text-sm">{label} *</Label>
      <button
        type="button"
        className={`relative border-2 border-dashed rounded-xl p-4 w-full text-center cursor-pointer transition-colors ${
          value
            ? "border-green-400 bg-green-50/50"
            : "border-border hover:border-primary/40 bg-muted/30"
        }`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept || "image/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        {value ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            <p className="text-sm font-body text-green-700 font-medium">
              Uploaded
            </p>
            {fileName && (
              <p className="text-xs text-muted-foreground font-body truncate max-w-full">
                {fileName}
              </p>
            )}
            {accept?.includes("image") && (
              <img
                src={value}
                alt={label}
                className="w-16 h-16 object-cover rounded-lg border border-border mt-1"
              />
            )}
            <button
              type="button"
              className="text-xs text-primary underline font-body"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
                setFileName("");
              }}
            >
              Change file
            </button>
          </div>
        ) : uploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground font-body">
              Uploading... {progress}%
            </p>
            <Progress
              value={progress}
              className="h-1.5 max-w-[200px] mx-auto"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-7 h-7 text-muted-foreground" />
            <p className="text-sm font-body text-muted-foreground">
              Click to upload
            </p>
            <p className="text-xs text-muted-foreground/70 font-body">{hint}</p>
          </div>
        )}
      </button>
    </div>
  );
}

export default function ApplicationFormPage() {
  const navigate = useNavigate();
  const submitApplication = useSubmitApplication();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const mobile = localStorage.getItem("applicantMobile") || "";

  useEffect(() => {
    if (!mobile) {
      navigate({ to: "/admission/apply" });
    }
  }, [mobile, navigate]);

  const [form, setForm] = useState<FormData>({
    applicantName: "",
    fatherName: "",
    dateOfBirth: "",
    applicantMobile: mobile,
    category: "",
    annualIncome: "",
    address: "",
    district: "",
    state: "Odisha",
    pinCode: "",
    institutionName: "",
    classYear: "",
    photoUrl: "",
    incomeCertUrl: "",
    casteCertUrl: "",
  });

  const update = (field: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!form.applicantName.trim()) return setError("Full name is required");
      if (!form.fatherName.trim()) return setError("Father's name is required");
      if (!form.dateOfBirth) return setError("Date of birth is required");
      if (!form.category) return setError("Community/category is required");
      if (!form.annualIncome.trim())
        return setError("Annual income is required");
    }
    if (step === 1) {
      if (!form.address.trim()) return setError("Address is required");
      if (!form.district.trim()) return setError("District is required");
      if (!form.pinCode.trim() || !/^\d{6}$/.test(form.pinCode))
        return setError("Enter a valid 6-digit PIN code");
      if (!form.institutionName.trim())
        return setError("School/College name is required");
      if (!form.classYear.trim()) return setError("Class/Year is required");
    }
    if (step === 2) {
      if (!form.photoUrl) return setError("Passport photo is required");
      if (!form.incomeCertUrl)
        return setError("Income certificate is required");
      if (!form.casteCertUrl)
        return setError("Caste/Community certificate is required");
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep() === true) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (validateStep() !== true) return;

    const application: AdmissionApplication = {
      id: 0,
      status: ApplicationStatus.pending,
      applicantName: form.applicantName.trim(),
      fatherName: form.fatherName.trim(),
      dateOfBirth: form.dateOfBirth,
      applicantMobile: form.applicantMobile,
      category: form.category,
      annualIncome: form.annualIncome.trim(),
      address: form.address.trim(),
      district: form.district.trim(),
      state: form.state,
      pinCode: form.pinCode,
      institutionName: form.institutionName.trim(),
      classYear: form.classYear.trim(),
      photoUrl: form.photoUrl,
      incomeCertUrl: form.incomeCertUrl,
      casteCertUrl: form.casteCertUrl,
      reviewNote: "",
      submittedAt: BigInt(Date.now()),
      reviewedAt: undefined,
    };

    try {
      await submitApplication.mutateAsync(application);
      toast.success("Application submitted successfully!");
      navigate({ to: "/admission/status" });
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit application";
      setError(msg);
      toast.error(msg);
    }
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-gradient py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate({ to: "/admission/apply" })}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-xl text-white">
                Hostel Admission Application
              </h1>
              <p className="text-white/60 text-xs font-body">
                Mobile: +91 {mobile}
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-2 mb-3">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-display font-bold flex-shrink-0 transition-colors ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                        ? "bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)]"
                        : "bg-white/20 text-white/50"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-xs font-body hidden sm:block ${
                    i === step ? "text-white" : "text-white/50"
                  }`}
                >
                  {s.label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 rounded ${
                      i < step ? "bg-green-400" : "bg-white/20"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Progress
            value={progressPct}
            className="h-1.5 bg-white/20 [&>div]:bg-[oklch(var(--saffron))]"
          />
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-destructive/40 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm font-body">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Personal Details
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 1 of 3
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="font-body text-sm">Full Name *</Label>
                  <Input
                    value={form.applicantName}
                    onChange={(e) => update("applicantName", e.target.value)}
                    placeholder="Mohammed Arif Khan"
                    className="font-body text-sm"
                    autoComplete="name"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Father's Name *</Label>
                  <Input
                    value={form.fatherName}
                    onChange={(e) => update("fatherName", e.target.value)}
                    placeholder="Abdul Karim Khan"
                    className="font-body text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Date of Birth *</Label>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className="font-body text-sm"
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Mobile Number</Label>
                  <Input
                    value={mobile}
                    disabled
                    className="font-body text-sm bg-muted"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Community / Category *
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => update("category", v)}
                  >
                    <SelectTrigger className="font-body text-sm">
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          className="font-body text-sm"
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="font-body text-sm">
                    Annual Family Income *
                  </Label>
                  <Input
                    value={form.annualIncome}
                    onChange={(e) => update("annualIncome", e.target.value)}
                    placeholder="e.g. ₹1,20,000 or Below 2 Lakh"
                    className="font-body text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Address & Education
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 2 of 3
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Permanent Address *
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="House No., Street, Village, Post Office..."
                    rows={3}
                    className="font-body text-sm resize-none"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">District *</Label>
                    <Input
                      value={form.district}
                      onChange={(e) => update("district", e.target.value)}
                      placeholder="e.g. Gajapati"
                      className="font-body text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">State</Label>
                    <Input
                      value={form.state}
                      disabled
                      className="font-body text-sm bg-muted"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">PIN Code *</Label>
                    <Input
                      inputMode="numeric"
                      value={form.pinCode}
                      onChange={(e) =>
                        update(
                          "pinCode",
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="761015"
                      className="font-body text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    School / College Name *
                  </Label>
                  <Input
                    value={form.institutionName}
                    onChange={(e) => update("institutionName", e.target.value)}
                    placeholder="e.g. Mohana College, Mohana"
                    className="font-body text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Class / Year of Study *
                  </Label>
                  <Input
                    value={form.classYear}
                    onChange={(e) => update("classYear", e.target.value)}
                    placeholder="e.g. Class 11 (Science) or 1st Year B.A."
                    className="font-body text-sm"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Upload Documents
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 3 of 3 — Upload clear images/scans of your documents
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 mb-2">
                <p className="text-xs text-amber-800 font-body">
                  <span className="font-semibold">Important:</span> Upload
                  clear, legible photos or scans. Blurry or illegible documents
                  may cause rejection.
                </p>
              </div>

              <FileUploadField
                label="Passport Size Photo"
                hint="JPG/PNG, clear face photo"
                value={form.photoUrl}
                onChange={(url) => update("photoUrl", url)}
                accept="image/*"
              />

              <FileUploadField
                label="Income Certificate"
                hint="Issued by competent authority"
                value={form.incomeCertUrl}
                onChange={(url) => update("incomeCertUrl", url)}
                accept="image/*,.pdf"
              />

              <FileUploadField
                label="Caste / Community Certificate"
                hint="Valid community certificate"
                value={form.casteCertUrl}
                onChange={(url) => update("casteCertUrl", url)}
                accept="image/*,.pdf"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={
              step === 0
                ? () => navigate({ to: "/admission/apply" })
                : handleBack
            }
            className="font-body gap-2"
            disabled={submitApplication.isPending}
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Back to Login" : "Previous"}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground font-body gap-2"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitApplication.isPending}
              className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold gap-2"
            >
              {submitApplication.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <GraduationCap className="w-4 h-4" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
