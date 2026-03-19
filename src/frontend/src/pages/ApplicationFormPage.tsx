import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  BookOpen,
  CheckCircle2,
  FileText,
  GraduationCap,
  Heart,
  Loader2,
  MapPin,
  Upload,
  User,
  Users,
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
  { label: "Guardian & Health", icon: Users },
  { label: "Academic Details", icon: BookOpen },
  { label: "Documents", icon: FileText },
];

interface AcademicRow {
  id: string;
  examination: string;
  board: string;
  yearOfPassing: string;
  division: string;
  percentage: string;
}

const emptyAcademicRow = (): AcademicRow => ({
  id: Math.random().toString(36).slice(2),
  examination: "",
  board: "",
  yearOfPassing: "",
  division: "",
  percentage: "",
});

interface FormData {
  // Step 1 - Personal
  hostelName: string;
  applicantName: string;
  dateOfBirth: string;
  gender: string;
  applicantMobile: string;
  category: string;
  mentionCommunity: string;
  photoIdentityType: string;
  photoIdentityNo: string;
  // Step 2 - Guardian & Health
  guardianName: string;
  guardianRelationship: string;
  guardianContact: string;
  guardianOccupation: string;
  annualIncome: string;
  localGuardianName: string;
  localGuardianMobile: string;
  presentAddress: string;
  address: string; // permanent address
  district: string;
  state: string;
  pinCode: string;
  bloodGroup: string;
  identificationMark: string;
  healthProblems: string;
  // Step 3 - Academic
  academicRows: AcademicRow[];
  courseName: string;
  courseDuration: string;
  currentYearSemester: string;
  institutionName: string;
  institutionAddress: string;
  // Step 4 - Documents
  photoUrl: string;
  incomeCertUrl: string;
  casteCertUrl: string;
  class10CertUrl: string;
  class12CertUrl: string;
  graduationCertUrl: string;
  residenceCertUrl: string;
  // Declaration
  selfDeclaration: boolean;
}

function FileUploadField({
  label,
  hint,
  value,
  onChange,
  accept,
  required = true,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  required?: boolean;
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
      <Label className="font-body text-sm">
        {label}{" "}
        {required ? (
          <span className="text-destructive">*</span>
        ) : (
          <span className="text-muted-foreground text-xs">(Optional)</span>
        )}
      </Label>
      <button
        type="button"
        className={`relative border-2 border-dashed rounded-xl p-4 w-full text-center cursor-pointer transition-colors ${
          value
            ? "border-green-400 bg-green-50/50"
            : "border-border hover:border-primary/40 bg-muted/30"
        }`}
        onClick={() => inputRef.current?.click()}
        data-ocid="admission.upload_button"
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
    if (!mobile) navigate({ to: "/admission/apply" });
  }, [mobile, navigate]);

  const [form, setForm] = useState<FormData>({
    hostelName: "Post Matric Minority Boys Hostel, Mohana",
    applicantName: "",
    dateOfBirth: "",
    gender: "",
    applicantMobile: mobile,
    category: "",
    mentionCommunity: "",
    photoIdentityType: "",
    photoIdentityNo: "",
    guardianName: "",
    guardianRelationship: "",
    guardianContact: "",
    guardianOccupation: "",
    annualIncome: "",
    localGuardianName: "",
    localGuardianMobile: "",
    presentAddress: "",
    address: "",
    district: "",
    state: "Odisha",
    pinCode: "",
    bloodGroup: "",
    identificationMark: "",
    healthProblems: "",
    academicRows: [emptyAcademicRow(), emptyAcademicRow(), emptyAcademicRow()],
    courseName: "",
    courseDuration: "",
    currentYearSemester: "",
    institutionName: "",
    institutionAddress: "",
    photoUrl: "",
    incomeCertUrl: "",
    casteCertUrl: "",
    class10CertUrl: "",
    class12CertUrl: "",
    graduationCertUrl: "",
    residenceCertUrl: "",
    selfDeclaration: false,
  });

  const update = (
    field: keyof FormData,
    value: string | boolean | AcademicRow[],
  ) => setForm((prev) => ({ ...prev, [field]: value }));

  const updateAcademicRow = (
    idx: number,
    field: keyof AcademicRow,
    value: string,
  ) => {
    const rows = form.academicRows.map((r, i) =>
      i === idx ? { ...r, [field]: value } : r,
    );
    update("academicRows", rows);
  };

  const validateStep = (): boolean => {
    setError("");
    if (step === 0) {
      if (!form.applicantName.trim()) {
        setError("Full name is required");
        return false;
      }
      if (!form.dateOfBirth) {
        setError("Date of birth is required");
        return false;
      }
      if (!form.gender) {
        setError("Gender is required");
        return false;
      }
      if (!form.category) {
        setError("Minority community is required");
        return false;
      }
    }
    if (step === 1) {
      if (!form.guardianName.trim()) {
        setError("Parent/Guardian name is required");
        return false;
      }
      if (!form.annualIncome.trim()) {
        setError("Annual family income is required");
        return false;
      }
      if (!form.address.trim()) {
        setError("Permanent address is required");
        return false;
      }
      if (!form.district.trim()) {
        setError("District is required");
        return false;
      }
      if (!form.pinCode.trim() || !/^\d{6}$/.test(form.pinCode)) {
        setError("Enter a valid 6-digit PIN code");
        return false;
      }
    }
    if (step === 2) {
      if (!form.institutionName.trim()) {
        setError("College/Institution name is required");
        return false;
      }
      if (!form.currentYearSemester.trim()) {
        setError("Current year/semester is required");
        return false;
      }
    }
    if (step === 3) {
      if (!form.photoUrl) {
        setError("Passport photo is required");
        return false;
      }
      if (!form.incomeCertUrl) {
        setError("Income certificate is required");
        return false;
      }
      if (!form.casteCertUrl) {
        setError("Caste/Community certificate is required");
        return false;
      }
      if (!form.residenceCertUrl) {
        setError("Residence certificate is required");
        return false;
      }
      if (!form.selfDeclaration) {
        setError("Please accept the self-declaration to proceed");
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) setStep((s) => s + 1);
  };

  const handleBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    const application: AdmissionApplication = {
      id: 0,
      status: ApplicationStatus.pending,
      applicantName: form.applicantName.trim(),
      fatherName: form.guardianName.trim(),
      dateOfBirth: form.dateOfBirth,
      applicantMobile: form.applicantMobile,
      category: form.category,
      annualIncome: form.annualIncome.trim(),
      address: form.address.trim(),
      district: form.district.trim(),
      state: form.state,
      pinCode: form.pinCode,
      institutionName: form.institutionName.trim(),
      classYear: form.currentYearSemester.trim(),
      photoUrl: form.photoUrl,
      incomeCertUrl: form.incomeCertUrl,
      casteCertUrl: form.casteCertUrl,
      reviewNote: "",
      submittedAt: BigInt(Date.now()),
      reviewedAt: undefined,
      // Extended fields
      guardianName: form.guardianName.trim(),
      guardianRelationship: form.guardianRelationship,
      guardianContact: form.guardianContact,
      guardianOccupation: form.guardianOccupation,
      localGuardianName: form.localGuardianName,
      localGuardianMobile: form.localGuardianMobile,
      presentAddress: form.presentAddress,
      bloodGroup: form.bloodGroup,
      identificationMark: form.identificationMark,
      healthProblems: form.healthProblems,
      mentionCommunity: form.mentionCommunity,
      photoIdentityType: form.photoIdentityType,
      photoIdentityNo: form.photoIdentityNo,
      courseName: form.courseName,
      courseDuration: form.courseDuration,
      institutionAddress: form.institutionAddress,
      currentYearSemester: form.currentYearSemester,
      academicRowsJson: JSON.stringify(form.academicRows),
      residenceCertUrl: form.residenceCertUrl,
      class10CertUrl: form.class10CertUrl,
      class12CertUrl: form.class12CertUrl,
      graduationCertUrl: form.graduationCertUrl,
    };

    try {
      await submitApplication.mutateAsync(application);
      localStorage.setItem(
        "applicationFormData",
        JSON.stringify({ ...form, submittedAt: Date.now() }),
      );
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/admission/apply" })}
              className="text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-white leading-tight">
                Application Form for Seeking Hostel Facility
              </h1>
              <p className="text-white/60 text-xs font-body">
                Post Matric Minority Hostel of ST &amp; SC Development
                Department &amp; M&amp;BCW Department, Govt. of Odisha
              </p>
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-1 mb-3">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-1 flex-1">
                <div
                  className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-display font-bold flex-shrink-0 transition-colors ${
                    i < step
                      ? "bg-green-500 text-white"
                      : i === step
                        ? "bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)]"
                        : "bg-white/20 text-white/50"
                  }`}
                >
                  {i < step ? <CheckCircle2 className="w-3.5 h-3.5" /> : i + 1}
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

      {/* Form Body */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <Alert className="mb-6 border-destructive/40 bg-destructive/5">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive text-sm font-body">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <AnimatePresence mode="wait">
          {/* ===== STEP 1: Personal Details ===== */}
          {step === 0 && (
            <motion.div
              key="step0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Personal Details
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 1 of 4
                  </p>
                </div>
              </div>

              {/* Hostel name & applicant name */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="font-body text-sm">
                    Name of Minority Hostel Applying For{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={form.hostelName}
                    onChange={(e) => update("hostelName", e.target.value)}
                    className="font-body text-sm"
                    data-ocid="admission.hostel_name.input"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <Label className="font-body text-sm">
                    Name of the Applicant{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={form.applicantName}
                    onChange={(e) => update("applicantName", e.target.value)}
                    placeholder="Full name as per documents"
                    className="font-body text-sm"
                    autoComplete="name"
                    data-ocid="admission.applicant_name.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Date of Birth <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(e) => update("dateOfBirth", e.target.value)}
                    className="font-body text-sm"
                    max={new Date().toISOString().split("T")[0]}
                    data-ocid="admission.dob.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Gender <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => update("gender", v)}
                  >
                    <SelectTrigger
                      className="font-body text-sm"
                      data-ocid="admission.gender.select"
                    >
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male" className="font-body text-sm">
                        Male
                      </SelectItem>
                      <SelectItem value="Female" className="font-body text-sm">
                        Female
                      </SelectItem>
                      <SelectItem value="Other" className="font-body text-sm">
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Minority Community{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-xs text-muted-foreground font-body">
                    (Attach Self-certified Community Certificate)
                  </p>
                  <Select
                    value={form.category}
                    onValueChange={(v) => update("category", v)}
                  >
                    <SelectTrigger
                      className="font-body text-sm"
                      data-ocid="admission.category.select"
                    >
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

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Mention Community</Label>
                  <Input
                    value={form.mentionCommunity}
                    onChange={(e) => update("mentionCommunity", e.target.value)}
                    placeholder="e.g. Sunni Muslim, Roman Catholic..."
                    className="font-body text-sm"
                    data-ocid="admission.mention_community.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Applicant's Mobile No
                  </Label>
                  <Input
                    value={mobile}
                    disabled
                    className="font-body text-sm bg-muted"
                  />
                </div>
              </div>

              {/* Photo Identity */}
              <div className="border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-body font-semibold text-foreground">
                  Applicant's Photo-Identity
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  (Voter Card / Aadhar Card / Driving License / any other)
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Identity Type</Label>
                    <Select
                      value={form.photoIdentityType}
                      onValueChange={(v) => update("photoIdentityType", v)}
                    >
                      <SelectTrigger
                        className="font-body text-sm"
                        data-ocid="admission.id_type.select"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Aadhar Card"
                          className="font-body text-sm"
                        >
                          Aadhar Card
                        </SelectItem>
                        <SelectItem
                          value="Voter Card"
                          className="font-body text-sm"
                        >
                          Voter Card
                        </SelectItem>
                        <SelectItem
                          value="Driving License"
                          className="font-body text-sm"
                        >
                          Driving License
                        </SelectItem>
                        <SelectItem value="Other" className="font-body text-sm">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Identity Number</Label>
                    <Input
                      value={form.photoIdentityNo}
                      onChange={(e) =>
                        update("photoIdentityNo", e.target.value)
                      }
                      placeholder="Enter ID number"
                      className="font-body text-sm"
                      data-ocid="admission.id_number.input"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground font-body italic">
                  (Attach a copy of Photo-Identity proof in documents step)
                </p>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 2: Parent/Guardian, Address & Health ===== */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Guardian, Address &amp; Health
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 2 of 4
                  </p>
                </div>
              </div>

              {/* Parent/Guardian */}
              <div className="border border-border rounded-xl p-4 space-y-4">
                <p className="text-sm font-body font-semibold text-foreground flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary" />
                  Details of Parent / Guardian (Father / Mother / Any other)
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={form.guardianName}
                      onChange={(e) => update("guardianName", e.target.value)}
                      placeholder="Father / Mother / Guardian name"
                      className="font-body text-sm"
                      data-ocid="admission.guardian_name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Relationship with Applicant
                    </Label>
                    <Select
                      value={form.guardianRelationship}
                      onValueChange={(v) => update("guardianRelationship", v)}
                    >
                      <SelectTrigger
                        className="font-body text-sm"
                        data-ocid="admission.guardian_rel.select"
                      >
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value="Father"
                          className="font-body text-sm"
                        >
                          Father
                        </SelectItem>
                        <SelectItem
                          value="Mother"
                          className="font-body text-sm"
                        >
                          Mother
                        </SelectItem>
                        <SelectItem
                          value="Guardian"
                          className="font-body text-sm"
                        >
                          Guardian
                        </SelectItem>
                        <SelectItem value="Other" className="font-body text-sm">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Contact Number</Label>
                    <Input
                      value={form.guardianContact}
                      onChange={(e) =>
                        update("guardianContact", e.target.value)
                      }
                      placeholder="Parent/Guardian mobile"
                      className="font-body text-sm"
                      inputMode="numeric"
                      data-ocid="admission.guardian_contact.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Major Occupation
                    </Label>
                    <Input
                      value={form.guardianOccupation}
                      onChange={(e) =>
                        update("guardianOccupation", e.target.value)
                      }
                      placeholder="e.g. Farmer, Business..."
                      className="font-body text-sm"
                      data-ocid="admission.guardian_occ.input"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="font-body text-sm">
                      Annual Family Income{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={form.annualIncome}
                      onChange={(e) => update("annualIncome", e.target.value)}
                      placeholder="e.g. ₹1,20,000 or Below 2 Lakh"
                      className="font-body text-sm"
                      data-ocid="admission.income.input"
                    />
                  </div>
                </div>
              </div>

              {/* Local Guardian */}
              <div className="border border-border rounded-xl p-4 space-y-3">
                <p className="text-sm font-body font-semibold text-foreground">
                  Name &amp; Contact No. of Local Guardian (If any)
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Local Guardian Name
                    </Label>
                    <Input
                      value={form.localGuardianName}
                      onChange={(e) =>
                        update("localGuardianName", e.target.value)
                      }
                      placeholder="Local guardian name"
                      className="font-body text-sm"
                      data-ocid="admission.local_guardian.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Mobile</Label>
                    <Input
                      value={form.localGuardianMobile}
                      onChange={(e) =>
                        update("localGuardianMobile", e.target.value)
                      }
                      placeholder="Local guardian mobile"
                      className="font-body text-sm"
                      inputMode="numeric"
                      data-ocid="admission.local_guardian_mobile.input"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary" />
                  <p className="text-sm font-body font-semibold text-foreground">
                    Address
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">Present Address</Label>
                  <Textarea
                    value={form.presentAddress}
                    onChange={(e) => update("presentAddress", e.target.value)}
                    placeholder="Current/present address"
                    rows={2}
                    className="font-body text-sm resize-none"
                    data-ocid="admission.present_address.textarea"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Permanent Address{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                    placeholder="House No., Street, Village, Post Office..."
                    rows={3}
                    className="font-body text-sm resize-none"
                    data-ocid="admission.perm_address.textarea"
                  />
                </div>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      District <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={form.district}
                      onChange={(e) => update("district", e.target.value)}
                      placeholder="e.g. Gajapati"
                      className="font-body text-sm"
                      data-ocid="admission.district.input"
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
                    <Label className="font-body text-sm">
                      PIN Code <span className="text-destructive">*</span>
                    </Label>
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
                      data-ocid="admission.pin.input"
                    />
                  </div>
                </div>
              </div>

              {/* Health Profile */}
              <div className="border border-border rounded-xl p-4 space-y-4">
                <p className="text-sm font-body font-semibold text-foreground flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-primary" />
                  Health Profile of the Applicant
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">Blood Group</Label>
                    <Select
                      value={form.bloodGroup}
                      onValueChange={(v) => update("bloodGroup", v)}
                    >
                      <SelectTrigger
                        className="font-body text-sm"
                        data-ocid="admission.blood_group.select"
                      >
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                          (bg) => (
                            <SelectItem
                              key={bg}
                              value={bg}
                              className="font-body text-sm"
                            >
                              {bg}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Any Identification Mark
                    </Label>
                    <Input
                      value={form.identificationMark}
                      onChange={(e) =>
                        update("identificationMark", e.target.value)
                      }
                      placeholder="e.g. Mole on left cheek"
                      className="font-body text-sm"
                      data-ocid="admission.id_mark.input"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Have you suffered any major health problem/disorder in last
                    3 years? If yes, mention the details:
                  </Label>
                  <Textarea
                    value={form.healthProblems}
                    onChange={(e) => update("healthProblems", e.target.value)}
                    placeholder="Enter details if any, or write 'None'"
                    rows={2}
                    className="font-body text-sm resize-none"
                    data-ocid="admission.health.textarea"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 3: Academic & Course Details ===== */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Academic &amp; Course Details
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 3 of 4
                  </p>
                </div>
              </div>

              {/* Academic Table */}
              <div className="space-y-3">
                <p className="text-sm font-body font-semibold text-foreground">
                  Academic Details of the Applicant
                </p>
                <p className="text-xs text-muted-foreground font-body italic">
                  (Starting from Matriculation. Attach self-attested
                  photo-copies of Mark-sheets and Certificates.)
                </p>
                <div className="overflow-x-auto border border-border rounded-xl">
                  <table className="w-full text-xs font-body">
                    <thead>
                      <tr className="bg-muted/60">
                        <th className="p-2 text-left font-semibold text-foreground border-b border-border min-w-[140px]">
                          Name of Examination
                        </th>
                        <th className="p-2 text-left font-semibold text-foreground border-b border-border min-w-[100px]">
                          Board / University
                        </th>
                        <th className="p-2 text-left font-semibold text-foreground border-b border-border min-w-[80px]">
                          Year of Passing
                        </th>
                        <th className="p-2 text-left font-semibold text-foreground border-b border-border min-w-[80px]">
                          Division / Grade
                        </th>
                        <th className="p-2 text-left font-semibold text-foreground border-b border-border min-w-[70px]">
                          % of Marks
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {form.academicRows.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="border-b border-border last:border-0"
                        >
                          <td className="p-1">
                            <Input
                              value={row.examination}
                              onChange={(e) =>
                                updateAcademicRow(
                                  idx,
                                  "examination",
                                  e.target.value,
                                )
                              }
                              placeholder={
                                idx === 0
                                  ? "Matriculation"
                                  : idx === 1
                                    ? "+2 / Intermediate"
                                    : "Graduation"
                              }
                              className="font-body text-xs h-8 border-0 focus-visible:ring-1"
                              data-ocid={`admission.exam_name.input.${idx + 1}`}
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              value={row.board}
                              onChange={(e) =>
                                updateAcademicRow(idx, "board", e.target.value)
                              }
                              placeholder="Board/University"
                              className="font-body text-xs h-8 border-0 focus-visible:ring-1"
                              data-ocid={`admission.board.input.${idx + 1}`}
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              value={row.yearOfPassing}
                              onChange={(e) =>
                                updateAcademicRow(
                                  idx,
                                  "yearOfPassing",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. 2022"
                              className="font-body text-xs h-8 border-0 focus-visible:ring-1"
                              inputMode="numeric"
                              data-ocid={`admission.year_passing.input.${idx + 1}`}
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              value={row.division}
                              onChange={(e) =>
                                updateAcademicRow(
                                  idx,
                                  "division",
                                  e.target.value,
                                )
                              }
                              placeholder="1st / A+"
                              className="font-body text-xs h-8 border-0 focus-visible:ring-1"
                              data-ocid={`admission.division.input.${idx + 1}`}
                            />
                          </td>
                          <td className="p-1">
                            <Input
                              value={row.percentage}
                              onChange={(e) =>
                                updateAcademicRow(
                                  idx,
                                  "percentage",
                                  e.target.value,
                                )
                              }
                              placeholder="75%"
                              className="font-body text-xs h-8 border-0 focus-visible:ring-1"
                              data-ocid={`admission.percentage.input.${idx + 1}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs font-body"
                  onClick={() =>
                    update("academicRows", [
                      ...form.academicRows,
                      emptyAcademicRow(),
                    ])
                  }
                >
                  + Add Row
                </Button>
              </div>

              {/* Course Details */}
              <div className="border border-border rounded-xl p-4 space-y-4">
                <p className="text-sm font-body font-semibold text-foreground">
                  Details of the Course for which Hostel Facility is Sought
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Name of the Course Pursuing
                    </Label>
                    <Input
                      value={form.courseName}
                      onChange={(e) => update("courseName", e.target.value)}
                      placeholder="e.g. B.A. (Honours), B.Sc..."
                      className="font-body text-sm"
                      data-ocid="admission.course_name.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Duration of the Course
                    </Label>
                    <Input
                      value={form.courseDuration}
                      onChange={(e) => update("courseDuration", e.target.value)}
                      placeholder="e.g. 3 Years"
                      className="font-body text-sm"
                      data-ocid="admission.course_duration.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body text-sm">
                      Presently in which Year / Semester{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      value={form.currentYearSemester}
                      onChange={(e) =>
                        update("currentYearSemester", e.target.value)
                      }
                      placeholder="e.g. 1st Year / 2nd Semester"
                      className="font-body text-sm"
                      data-ocid="admission.year_sem.input"
                    />
                  </div>
                </div>
              </div>

              {/* College/Institution */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Name of College / Institution{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    value={form.institutionName}
                    onChange={(e) => update("institutionName", e.target.value)}
                    placeholder="e.g. Mohana College, Mohana"
                    className="font-body text-sm"
                    data-ocid="admission.institution.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-body text-sm">
                    Address of College / Institution
                  </Label>
                  <Textarea
                    value={form.institutionAddress}
                    onChange={(e) =>
                      update("institutionAddress", e.target.value)
                    }
                    placeholder="College/Institution full address"
                    rows={2}
                    className="font-body text-sm resize-none"
                    data-ocid="admission.institution_addr.textarea"
                  />
                </div>
                <p className="text-xs text-muted-foreground font-body italic">
                  (Attach Proof of admission/Continuation in the mentioned
                  course and college/institution)
                </p>
              </div>
            </motion.div>
          )}

          {/* ===== STEP 4: Documents ===== */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg text-foreground">
                    Upload Documents
                  </h2>
                  <p className="text-muted-foreground text-xs font-body">
                    Step 4 of 4 — Upload clear images/scans of your documents
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-800 font-body">
                  <span className="font-semibold">Important:</span> Upload
                  clear, legible photos or scans. Blurry or illegible documents
                  may cause rejection.
                </p>
              </div>

              <FileUploadField
                label="Passport Size Photo"
                hint="Recent colour photograph, passport size"
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
                hint="Self-certified community certificate"
                value={form.casteCertUrl}
                onChange={(url) => update("casteCertUrl", url)}
                accept="image/*,.pdf"
              />

              <FileUploadField
                label="Residence Certificate"
                hint="Valid residence/domicile certificate"
                value={form.residenceCertUrl}
                onChange={(url) => update("residenceCertUrl", url)}
                accept="image/*,.pdf"
              />

              <div className="border-t border-border pt-4 space-y-4">
                <p className="text-xs font-body font-semibold text-foreground">
                  Academic Certificates
                </p>

                <FileUploadField
                  label="Class 10th Certificate"
                  hint="Matric/10th Board mark-sheet & certificate"
                  value={form.class10CertUrl}
                  onChange={(url) => update("class10CertUrl", url)}
                  accept="image/*,.pdf"
                  required={false}
                />

                <FileUploadField
                  label="Class 12th Certificate"
                  hint="Intermediate/12th Board mark-sheet & certificate"
                  value={form.class12CertUrl}
                  onChange={(url) => update("class12CertUrl", url)}
                  accept="image/*,.pdf"
                  required={false}
                />

                <FileUploadField
                  label="Graduation Certificate"
                  hint="Degree/Graduation certificate"
                  value={form.graduationCertUrl}
                  onChange={(url) => update("graduationCertUrl", url)}
                  accept="image/*,.pdf"
                  required={false}
                />
              </div>

              {/* Self Declaration */}
              <div className="border border-border rounded-xl p-4 space-y-3 bg-muted/20">
                <p className="text-sm font-body font-semibold text-foreground">
                  Self-Declaration by the Applicant
                </p>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  I hereby declare that the information given by me in the
                  application form is true to the best of my knowledge. I also
                  undertake that at any stage, if it is found to the
                  satisfaction of the appropriate authority that the information
                  supplied in the application form is false, I may be penalized
                  as per law.
                </p>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="selfDeclaration"
                    checked={form.selfDeclaration}
                    onCheckedChange={(checked) =>
                      update("selfDeclaration", !!checked)
                    }
                    data-ocid="admission.declaration.checkbox"
                  />
                  <Label
                    htmlFor="selfDeclaration"
                    className="text-sm font-body cursor-pointer leading-relaxed"
                  >
                    I accept the above declaration and undertake to abide by the
                    hostel rules and regulations.
                  </Label>
                </div>
              </div>
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
            data-ocid="admission.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            {step === 0 ? "Back to Login" : "Previous"}
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-primary text-primary-foreground font-body gap-2"
              data-ocid="admission.next.button"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitApplication.isPending}
              className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold gap-2"
              data-ocid="admission.submit.button"
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
