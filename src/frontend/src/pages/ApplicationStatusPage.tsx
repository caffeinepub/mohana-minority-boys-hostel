import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  GraduationCap,
  LogOut,
  MapPin,
  Phone,
  RefreshCw,
  User,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ApplicationStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useGetMyApplication, useLoginApplicant } from "../hooks/useQueries";

function formatDate(ts?: bigint | number): string {
  if (!ts) return "—";
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface LocalFormData {
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
  class10CertUrl: string;
  class12CertUrl: string;
  graduationCertUrl: string;
  residenceCertUrl: string;
  submittedAt: number;
}

export default function ApplicationStatusPage() {
  const navigate = useNavigate();
  const mobile = localStorage.getItem("applicantMobile") || "";
  const pin = localStorage.getItem("applicantPin") || "";
  const loginApplicant = useLoginApplicant();
  const { actor } = useActor();
  const [sessionReady, setSessionReady] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const loginApplicantMutate = loginApplicant.mutateAsync;

  useEffect(() => {
    if (!mobile) {
      navigate({ to: "/admission/apply" });
      return;
    }
    if (pin && actor) {
      loginApplicantMutate({ mobile, pin })
        .then(() => setSessionReady(true))
        .catch(() => setSessionReady(true));
    } else if (actor) {
      setSessionReady(true);
    }
  }, [mobile, pin, actor, navigate, loginApplicantMutate]);

  const {
    data: application,
    isLoading,
    refetch,
  } = useGetMyApplication(mobile, sessionReady);

  // Load extra local form data (new certificate fields)
  const localFormData: LocalFormData | null = (() => {
    try {
      const raw = localStorage.getItem("applicationFormData");
      return raw ? (JSON.parse(raw) as LocalFormData) : null;
    } catch {
      return null;
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("applicantMobile");
    localStorage.removeItem("applicantName");
    localStorage.removeItem("applicantPin");
    navigate({ to: "/admission/apply" });
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  const app = application;

  return (
    <div className="min-h-screen bg-background">
      {/* ===== PRINT-ONLY APPLICATION FORM ===== */}
      {app && (
        <div
          ref={printRef}
          className="hidden print:block print:fixed print:inset-0 print:bg-white print:z-[9999] print:p-8 print:overflow-auto"
          style={{ fontFamily: "serif" }}
        >
          {/* Header */}
          <div
            style={{
              textAlign: "center",
              borderBottom: "2px solid #1a3a6e",
              paddingBottom: "12px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                marginBottom: "8px",
              }}
            >
              <img
                src="/assets/generated/odisha-govt-logo-transparent.dim_200x200.png"
                alt="Odisha Government"
                style={{ width: "64px", height: "64px", objectFit: "contain" }}
              />
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "#555",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                  }}
                >
                  Government of Odisha
                </div>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1a3a6e",
                    lineHeight: 1.2,
                  }}
                >
                  Post Matric Minority Boys Hostel
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#1a3a6e",
                  }}
                >
                  Mohana, Gajapati District, Odisha — 761015
                </div>
                <div
                  style={{ fontSize: "11px", color: "#555", marginTop: "2px" }}
                >
                  Under Ministry of Minority Affairs, Govt. of India
                </div>
              </div>
              <img
                src="/assets/generated/ministry-minority-affairs-logo-transparent.dim_200x200.png"
                alt="Ministry of Minority Affairs"
                style={{ width: "64px", height: "64px", objectFit: "contain" }}
              />
            </div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: "bold",
                color: "#c8860a",
                letterSpacing: "1px",
                marginTop: "6px",
              }}
            >
              APPLICATION FOR HOSTEL ADMISSION
            </div>
            <div style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>
              Academic Session — {new Date().getFullYear()}–
              {new Date().getFullYear() + 1}
            </div>
          </div>

          {/* Applicant photo */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <div style={{ flex: 1 }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12px",
                }}
              >
                <tbody>
                  {[
                    ["Application No.", `APP-${app.id || "PENDING"}`],
                    [
                      "Date of Submission",
                      localFormData
                        ? formatDate(localFormData.submittedAt)
                        : formatDate(app.submittedAt),
                    ],
                    ["Full Name", app.applicantName],
                    ["Father's Name", app.fatherName],
                    ["Date of Birth", app.dateOfBirth],
                    ["Mobile Number", `+91 ${app.applicantMobile}`],
                    ["Community / Category", app.category],
                    ["Annual Family Income", app.annualIncome],
                  ].map(([label, value]) => (
                    <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
                      <td
                        style={{
                          padding: "5px 8px",
                          fontWeight: "bold",
                          color: "#444",
                          width: "40%",
                          background: "#f8f8f8",
                        }}
                      >
                        {label}
                      </td>
                      <td style={{ padding: "5px 8px", color: "#222" }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {app.photoUrl && (
              <div style={{ marginLeft: "16px", textAlign: "center" }}>
                <img
                  src={app.photoUrl}
                  alt="Applicant portrait"
                  style={{
                    width: "90px",
                    height: "110px",
                    objectFit: "cover",
                    border: "1px solid #ccc",
                  }}
                />
                <div
                  style={{ fontSize: "10px", color: "#666", marginTop: "4px" }}
                >
                  Passport Photo
                </div>
              </div>
            )}
          </div>

          {/* Address & Education */}
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                background: "#1a3a6e",
                color: "white",
                padding: "4px 8px",
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              ADDRESS &amp; EDUCATION DETAILS
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <tbody>
                {[
                  ["Permanent Address", app.address],
                  ["District", app.district],
                  ["State", app.state],
                  ["PIN Code", app.pinCode],
                  ["Institution Name", app.institutionName],
                  ["Class / Year", app.classYear],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        padding: "5px 8px",
                        fontWeight: "bold",
                        color: "#444",
                        width: "40%",
                        background: "#f8f8f8",
                      }}
                    >
                      {label}
                    </td>
                    <td style={{ padding: "5px 8px", color: "#222" }}>
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Documents Submitted */}
          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                background: "#1a3a6e",
                color: "white",
                padding: "4px 8px",
                fontWeight: "bold",
                fontSize: "12px",
                marginBottom: "6px",
              }}
            >
              DOCUMENTS SUBMITTED
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
              }}
            >
              <tbody>
                {[
                  [
                    "Passport Size Photo",
                    app.photoUrl ? "Uploaded" : "Not uploaded",
                  ],
                  [
                    "Income Certificate",
                    app.incomeCertUrl ? "Uploaded" : "Not uploaded",
                  ],
                  [
                    "Caste / Community Certificate",
                    app.casteCertUrl ? "Uploaded" : "Not uploaded",
                  ],
                  [
                    "Residence Certificate",
                    localFormData?.residenceCertUrl
                      ? "Uploaded"
                      : "Not uploaded",
                  ],
                  [
                    "Class 10th Certificate",
                    localFormData?.class10CertUrl ? "Uploaded" : "Not uploaded",
                  ],
                  [
                    "Class 12th Certificate",
                    localFormData?.class12CertUrl ? "Uploaded" : "Not uploaded",
                  ],
                  [
                    "Graduation Certificate",
                    localFormData?.graduationCertUrl
                      ? "Uploaded"
                      : "Not uploaded",
                  ],
                ].map(([label, value]) => (
                  <tr key={label} style={{ borderBottom: "1px solid #eee" }}>
                    <td
                      style={{
                        padding: "5px 8px",
                        fontWeight: "bold",
                        color: "#444",
                        width: "50%",
                        background: "#f8f8f8",
                      }}
                    >
                      {label}
                    </td>
                    <td
                      style={{
                        padding: "5px 8px",
                        color: value === "Uploaded" ? "#16a34a" : "#dc2626",
                        fontWeight: "bold",
                      }}
                    >
                      {value === "Uploaded" ? "✓ Uploaded" : "✗ Not uploaded"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Declaration */}
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "14px",
              fontSize: "11px",
              color: "#444",
            }}
          >
            <strong>Declaration:</strong> I hereby declare that all the
            information furnished above is true and correct to the best of my
            knowledge. I understand that providing false information may lead to
            cancellation of my application / hostel admission.
          </div>

          {/* Signatures */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "20px",
              fontSize: "12px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: "4px",
                  width: "150px",
                  marginTop: "40px",
                }}
              >
                Applicant's Signature
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: "4px",
                  width: "150px",
                  marginTop: "40px",
                }}
              >
                Parent/Guardian Signature
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  borderTop: "1px solid #333",
                  paddingTop: "4px",
                  width: "150px",
                  marginTop: "40px",
                }}
              >
                Hostel Superintendent
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: "center",
              marginTop: "16px",
              fontSize: "10px",
              color: "#777",
              borderTop: "1px solid #ccc",
              paddingTop: "8px",
            }}
          >
            Post Matric Minority Boys Hostel, Mohana, Gajapati, Odisha — 761015
            | stsc.odisha.gov.in
          </div>
        </div>
      )}

      {/* ===== SCREEN VIEW ===== */}
      {/* Header */}
      <div className="navy-gradient py-8 px-4 print:hidden">
        <div className="max-w-2xl mx-auto flex items-start justify-between">
          <div>
            <h1 className="font-display font-bold text-2xl text-white mb-1">
              Application Status
            </h1>
            <p className="text-white/60 text-sm font-body">
              Mobile: +91 {mobile}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-white/70 hover:text-white hover:bg-white/10 font-body gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 print:hidden">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
        ) : !application ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="font-display font-bold text-xl text-foreground mb-2">
              No Application Found
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-6">
              You haven't submitted an admission application yet.
            </p>
            <Link to="/admission/form">
              <Button className="bg-primary text-primary-foreground font-body gap-2">
                <GraduationCap className="w-4 h-4" />
                Fill Application Form
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Status Card */}
            <div
              className={`rounded-2xl p-6 text-center ${
                application.status === ApplicationStatus.approved
                  ? "bg-gradient-to-br from-green-600 to-green-700"
                  : application.status === ApplicationStatus.rejected
                    ? "bg-gradient-to-br from-red-600 to-red-700"
                    : "bg-gradient-to-br from-amber-500 to-amber-600"
              } text-white relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white blur-3xl" />
              </div>

              {application.status === ApplicationStatus.approved && (
                <>
                  <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-100" />
                  <Badge className="bg-white text-green-700 font-body text-xs mb-3 border-0">
                    APPROVED
                  </Badge>
                  <h2 className="font-display font-bold text-2xl mb-3">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-white/90 font-body text-sm leading-relaxed max-w-md mx-auto">
                    You are eligible to join the hostel. Please report to the
                    Hostel Office with all original documents within the
                    stipulated time.
                  </p>
                  {application.reviewNote && (
                    <div className="mt-4 p-3 rounded-xl bg-white/15 text-left">
                      <p className="text-xs text-white/80 font-body">
                        <span className="font-semibold text-white">
                          Note from Admin:
                        </span>{" "}
                        {application.reviewNote}
                      </p>
                    </div>
                  )}
                </>
              )}

              {application.status === ApplicationStatus.rejected && (
                <>
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-100" />
                  <Badge className="bg-white text-red-700 font-body text-xs mb-3 border-0">
                    NOT APPROVED
                  </Badge>
                  <h2 className="font-display font-bold text-xl mb-3">
                    Application Not Approved
                  </h2>
                  <p className="text-white/90 font-body text-sm leading-relaxed max-w-md mx-auto">
                    Unfortunately, your application was not approved at this
                    time. Please contact the hostel office for more information.
                  </p>
                  {application.reviewNote && (
                    <div className="mt-4 p-3 rounded-xl bg-white/15 text-left">
                      <p className="text-xs text-white/80 font-body">
                        <span className="font-semibold text-white">
                          Reason:
                        </span>{" "}
                        {application.reviewNote}
                      </p>
                    </div>
                  )}
                </>
              )}

              {application.status === ApplicationStatus.pending && (
                <>
                  <Clock className="w-16 h-16 mx-auto mb-4 text-amber-100" />
                  <Badge className="bg-white text-amber-700 font-body text-xs mb-3 border-0">
                    UNDER REVIEW
                  </Badge>
                  <h2 className="font-display font-bold text-xl mb-3">
                    Application Under Review
                  </h2>
                  <p className="text-white/90 font-body text-sm leading-relaxed max-w-md mx-auto">
                    Your application has been submitted successfully and is
                    being reviewed by the hostel authority. Please check back
                    for updates.
                  </p>
                </>
              )}
            </div>

            {/* Download PDF Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleDownloadPDF}
                className="bg-primary text-primary-foreground font-body gap-2 px-6"
                data-ocid="application.download_button"
              >
                <Download className="w-4 h-4" />
                Download Application as PDF
              </Button>
            </div>

            {/* Application Details */}
            <Card className="border-border shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-display text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Application Details
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refetch()}
                    className="font-body text-xs gap-1.5 h-8"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <DetailItem
                    icon={User}
                    label="Full Name"
                    value={application.applicantName}
                  />
                  <DetailItem
                    icon={User}
                    label="Father's Name"
                    value={application.fatherName}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Mobile"
                    value={`+91 ${application.applicantMobile}`}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Date of Birth"
                    value={application.dateOfBirth}
                  />
                  <DetailItem
                    icon={User}
                    label="Community"
                    value={application.category}
                  />
                  <DetailItem
                    icon={User}
                    label="Annual Income"
                    value={application.annualIncome}
                  />
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                  <DetailItem
                    icon={MapPin}
                    label="District"
                    value={application.district}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="PIN Code"
                    value={application.pinCode}
                  />
                  <DetailItem
                    icon={Building2}
                    label="Institution"
                    value={application.institutionName}
                    className="col-span-2"
                  />
                  <DetailItem
                    icon={GraduationCap}
                    label="Class/Year"
                    value={application.classYear}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Submitted On"
                    value={formatDate(application.submittedAt)}
                  />
                </div>

                {/* Document links */}
                <div className="border-t border-border pt-4">
                  <p className="text-xs font-body font-semibold text-foreground mb-3">
                    Uploaded Documents
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {application.photoUrl && (
                      <a
                        href={application.photoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Passport Photo
                      </a>
                    )}
                    {application.incomeCertUrl && (
                      <a
                        href={application.incomeCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Income Certificate
                      </a>
                    )}
                    {application.casteCertUrl && (
                      <a
                        href={application.casteCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Caste Certificate
                      </a>
                    )}
                    {localFormData?.residenceCertUrl && (
                      <a
                        href={localFormData.residenceCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Residence Certificate
                      </a>
                    )}
                    {localFormData?.class10CertUrl && (
                      <a
                        href={localFormData.class10CertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Class 10th Certificate
                      </a>
                    )}
                    {localFormData?.class12CertUrl && (
                      <a
                        href={localFormData.class12CertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Class 12th Certificate
                      </a>
                    )}
                    {localFormData?.graduationCertUrl && (
                      <a
                        href={localFormData.graduationCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" /> Graduation Certificate
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact info */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <p className="text-xs text-muted-foreground font-body leading-relaxed">
                For queries, contact the Hostel Superintendent at{" "}
                <a
                  href="tel:+919876543210"
                  className="text-primary font-semibold"
                >
                  +91 9876543210
                </a>{" "}
                or visit the hostel office during working hours (10 AM – 5 PM).
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DetailItem({
  icon: Icon,
  label,
  value,
  className = "",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`space-y-0.5 ${className}`}>
      <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </p>
      <p className="text-sm font-body font-medium text-foreground truncate">
        {value || "—"}
      </p>
    </div>
  );
}
