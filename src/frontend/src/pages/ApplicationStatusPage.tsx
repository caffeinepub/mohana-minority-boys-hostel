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
import { useEffect, useState } from "react";
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
  mentionCommunity?: string;
  photoIdentityType?: string;
  photoIdentityNo?: string;
  annualIncome: string;
  guardianName?: string;
  guardianRelationship?: string;
  guardianContact?: string;
  guardianOccupation?: string;
  localGuardianName?: string;
  localGuardianMobile?: string;
  presentAddress?: string;
  address: string;
  district: string;
  state: string;
  pinCode: string;
  bloodGroup?: string;
  identificationMark?: string;
  healthProblems?: string;
  academicRows?: Array<{
    exam: string;
    board: string;
    year: string;
    marks: string;
    percentage: string;
  }>;
  courseName?: string;
  courseDuration?: string;
  currentYearSemester?: string;
  institutionName: string;
  institutionAddress?: string;
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
    const app = application;
    if (!app) return;
    const localData: LocalFormData | null = (() => {
      try {
        const raw = localStorage.getItem("applicationFormData");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    })();

    const fmtDate = (ts?: bigint | number) => {
      if (!ts) return "—";
      const ms = typeof ts === "bigint" ? Number(ts) : ts;
      return new Date(ms).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const docStatus = (url?: string) =>
      url
        ? '<span style="color:#16a34a;font-weight:bold;">✓ Uploaded</span>'
        : '<span style="color:#dc2626;font-weight:bold;">✗ Not Uploaded</span>';

    const str = (v?: string | null) => v || "—";

    // Build academic rows table
    const academicRowsHtml = (() => {
      const rows = (() => {
        try {
          if (app.academicRowsJson) return JSON.parse(app.academicRowsJson);
          return localData?.academicRows || [];
        } catch {
          return localData?.academicRows || [];
        }
      })();
      if (!rows || rows.length === 0) {
        return '<tr><td colspan="5" style="text-align:center;color:#999;">No academic records provided</td></tr>';
      }
      return rows
        .map(
          (r) =>
            `<tr><td>${r.exam || "—"}</td><td>${r.board || "—"}</td><td>${r.year || "—"}</td><td>${r.marks || "—"}</td><td>${r.percentage || "—"}</td></tr>`,
        )
        .join("");
    })();

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Application Form - PMMH</title>
<style>
  body { font-family: serif; padding: 24px; color: #222; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 14px; }
  td { padding: 5px 9px; border: 1px solid #ccc; }
  .label { background: #f0f4ff; font-weight: bold; color: #1a3a6e; width: 38%; }
  .section-header { background: #1a3a6e; color: white; padding: 6px 10px; font-weight: bold; font-size: 13px; margin-bottom: 0; letter-spacing: 0.5px; }
  .header { text-align: center; border-bottom: 3px solid #1a3a6e; padding-bottom: 12px; margin-bottom: 16px; }
  .logos { display: flex; align-items: center; justify-content: center; gap: 20px; }
  .center-text { text-align: center; }
  .declaration { border: 1px solid #ccc; padding: 10px; font-size: 11px; color: #444; margin-bottom: 14px; background: #fafafa; }
  .signatures { display: flex; justify-content: space-between; margin-top: 30px; }
  .sig-box { text-align: center; }
  .sig-line { border-top: 1px solid #888; width: 180px; margin: 0 auto 4px; }
  .footer-note { text-align: center; font-size: 11px; color: #555; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 8px; }
  .th { background: #1a3a6e; color: white; padding: 5px 9px; font-weight: bold; }
  @media print { body { padding: 12px; } }
</style>
</head>
<body>

<!-- HEADER -->
<div class="header">
  <div class="logos">
    <img src="${window.location.origin}/assets/uploads/odisha-logo-1.jpg" width="70" height="70" style="object-fit:contain;" alt="Odisha Govt"/>
    <div class="center-text">
      <div style="font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;">Government of Odisha</div>
      <div style="font-size:20px;font-weight:bold;color:#1a3a6e;margin:2px 0;">Post Matric Minority Boys Hostel</div>
      <div style="font-size:13px;font-weight:bold;color:#1a3a6e;">Mohana, Gajapati District, Odisha — 761015</div>
      <div style="font-size:11px;color:#555;margin-top:3px;">Under ST &amp; SC Development M&amp;BC Department of Odisha</div>
    </div>
    <img src="${window.location.origin}/assets/uploads/Ministry_of_Minority_Affairs-2.webp" width="70" height="70" style="object-fit:contain;" alt="Ministry of Minority Affairs"/>
  </div>
  <div style="font-size:15px;font-weight:bold;color:#c8860a;letter-spacing:1px;margin-top:8px;">APPLICATION FOR HOSTEL ADMISSION</div>
  <div style="font-size:11px;color:#777;margin-top:2px;">Academic Session — ${new Date().getFullYear()}–${new Date().getFullYear() + 1}</div>
</div>

<!-- APPLICATION INFO ROW -->
<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:14px;">
  <table style="flex:1;margin-bottom:0;">
    <tbody>
      <tr><td class="label">Application No.</td><td>APP-${app.id || "PENDING"}</td></tr>
      <tr><td class="label">Date of Submission</td><td>${localData ? fmtDate(localData.submittedAt) : fmtDate(app.submittedAt)}</td></tr>
    </tbody>
  </table>
  ${app.photoUrl ? `<div style="margin-left:16px;text-align:center;flex-shrink:0;"><img src="${app.photoUrl}" width="90" height="110" style="object-fit:cover;border:2px solid #1a3a6e;" alt="Photo"/><div style="font-size:10px;color:#666;margin-top:4px;">Passport Photo</div></div>` : ""}
</div>

<!-- SECTION 1: PERSONAL DETAILS -->
<div class="section-header">1. PERSONAL DETAILS</div>
<table>
  <tbody>
    <tr><td class="label">Full Name of Applicant</td><td>${str(localData?.applicantName || app.applicantName)}</td></tr>
    <tr><td class="label">Father's Name</td><td>${str(localData?.fatherName || app.fatherName)}</td></tr>
    <tr><td class="label">Date of Birth</td><td>${str(localData?.dateOfBirth || app.dateOfBirth)}</td></tr>
    <tr><td class="label">Mobile Number</td><td>+91 ${str(localData?.applicantMobile || app.applicantMobile)}</td></tr>
    <tr><td class="label">Community / Category</td><td>${str(localData?.category || app.category)}</td></tr>
    ${localData?.mentionCommunity || app.mentionCommunity ? `<tr><td class="label">Mention Community</td><td>${localData?.mentionCommunity || app.mentionCommunity}</td></tr>` : ""}
    ${localData?.photoIdentityType || app.photoIdentityType ? `<tr><td class="label">Photo Identity Type</td><td>${localData?.photoIdentityType || app.photoIdentityType}</td></tr>` : ""}
    ${localData?.photoIdentityNo || app.photoIdentityNo ? `<tr><td class="label">Photo Identity No.</td><td>${localData?.photoIdentityNo || app.photoIdentityNo}</td></tr>` : ""}
    <tr><td class="label">Annual Family Income</td><td>${str(localData?.annualIncome || app.annualIncome)}</td></tr>
  </tbody>
</table>

<!-- SECTION 2: GUARDIAN & HEALTH DETAILS -->
<div class="section-header">2. GUARDIAN &amp; HEALTH DETAILS</div>
<table>
  <tbody>
    <tr><td class="label">Guardian's Name</td><td>${str(localData?.guardianName || app.guardianName)}</td></tr>
    <tr><td class="label">Relationship with Guardian</td><td>${str(localData?.guardianRelationship || app.guardianRelationship)}</td></tr>
    <tr><td class="label">Guardian's Contact No.</td><td>${str(localData?.guardianContact || app.guardianContact)}</td></tr>
    <tr><td class="label">Guardian's Occupation</td><td>${str(localData?.guardianOccupation || app.guardianOccupation)}</td></tr>
    <tr><td class="label">Local Guardian's Name</td><td>${str(localData?.localGuardianName || app.localGuardianName)}</td></tr>
    <tr><td class="label">Local Guardian's Mobile</td><td>${str(localData?.localGuardianMobile || app.localGuardianMobile)}</td></tr>
    <tr><td class="label">Present Address</td><td>${str(localData?.presentAddress || app.presentAddress)}</td></tr>
    <tr><td class="label">Permanent Address</td><td>${str(localData?.address || app.address)}</td></tr>
    <tr><td class="label">District</td><td>${str(localData?.district || app.district)}</td></tr>
    <tr><td class="label">State</td><td>${str(localData?.state || app.state)}</td></tr>
    <tr><td class="label">PIN Code</td><td>${str(localData?.pinCode || app.pinCode)}</td></tr>
    <tr><td class="label">Blood Group</td><td>${str(localData?.bloodGroup || app.bloodGroup)}</td></tr>
    <tr><td class="label">Identification Mark</td><td>${str(localData?.identificationMark || app.identificationMark)}</td></tr>
    <tr><td class="label">Health Problems (if any)</td><td>${str(localData?.healthProblems || app.healthProblems)}</td></tr>
  </tbody>
</table>

<!-- SECTION 3: ACADEMIC DETAILS -->
<div class="section-header">3. ACADEMIC DETAILS</div>
<table>
  <thead>
    <tr>
      <td class="th">Examination</td>
      <td class="th">Board / University</td>
      <td class="th">Year</td>
      <td class="th">Max Marks</td>
      <td class="th">Percentage</td>
    </tr>
  </thead>
  <tbody>
    ${academicRowsHtml}
  </tbody>
</table>
<table>
  <tbody>
    <tr><td class="label">Course Name</td><td>${str(localData?.courseName || app.courseName)}</td></tr>
    <tr><td class="label">Course Duration</td><td>${str(localData?.courseDuration || app.courseDuration)}</td></tr>
    <tr><td class="label">Current Year / Semester</td><td>${str(localData?.currentYearSemester || app.currentYearSemester || localData?.classYear || app.classYear)}</td></tr>
    <tr><td class="label">Institution Name</td><td>${str(localData?.institutionName || app.institutionName)}</td></tr>
    <tr><td class="label">Institution Address</td><td>${str(localData?.institutionAddress || app.institutionAddress)}</td></tr>
  </tbody>
</table>

<!-- SECTION 4: DOCUMENTS SUBMITTED -->
<div class="section-header">4. DOCUMENTS SUBMITTED</div>
<table>
  <tbody>
    <tr><td class="label">Passport Size Photo</td><td>${docStatus(localData?.photoUrl || app.photoUrl)}</td></tr>
    <tr><td class="label">Income Certificate</td><td>${docStatus(localData?.incomeCertUrl || app.incomeCertUrl)}</td></tr>
    <tr><td class="label">Caste / Community Certificate</td><td>${docStatus(localData?.casteCertUrl || app.casteCertUrl)}</td></tr>
    <tr><td class="label">Residence Certificate</td><td>${docStatus(localData?.residenceCertUrl || app.residenceCertUrl)}</td></tr>
    <tr><td class="label">Class 10th Certificate</td><td>${docStatus(localData?.class10CertUrl || app.class10CertUrl)}</td></tr>
    <tr><td class="label">Class 12th Certificate</td><td>${docStatus(localData?.class12CertUrl || app.class12CertUrl)}</td></tr>
    <tr><td class="label">Graduation Certificate</td><td>${docStatus(localData?.graduationCertUrl || app.graduationCertUrl)}</td></tr>
  </tbody>
</table>

<!-- DECLARATION -->
<div class="declaration">
  <strong>Declaration:</strong> I hereby declare that all the information furnished above is true and correct to the best of my knowledge and belief. I understand that providing false information may lead to cancellation of my application / hostel admission. I agree to abide by the rules and regulations of the hostel.
</div>

<!-- SIGNATURES -->
<div class="signatures">
  <div class="sig-box">
    <div class="sig-line"></div>
    <div style="font-size:12px;">Signature of Applicant</div>
    <div style="margin-top:4px;font-size:11px;color:#666;">${str(localData?.applicantName || app.applicantName)}</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div style="font-size:12px;">Signature of Parent / Guardian</div>
    <div style="margin-top:4px;font-size:11px;color:#666;">${str(localData?.guardianName)}</div>
  </div>
  <div class="sig-box">
    <div class="sig-line"></div>
    <div style="font-size:12px;">Signature of Superintendent</div>
    <div style="margin-top:4px;font-size:11px;color:#666;">Post Matric Minority Boys Hostel</div>
  </div>
</div>

<div class="footer-note">
  This hostel is supported by ST &amp; SC Development M&amp;BC Department of Odisha and Ministry of Minority Affairs of India
</div>
</body>
</html>`;

    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups and try again.");
      return;
    }
    win.document.write(html);
    win.document.close();
    win.onload = () => {
      win.focus();
      win.print();
    };
  };

  return (
    <div className="min-h-screen bg-background">
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
