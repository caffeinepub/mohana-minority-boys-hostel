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

function formatDate(ts?: bigint): string {
  if (!ts) return "—";
  const ms = Number(ts);
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
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
    // Re-establish backend session on every page load so getMyApplication works
    if (pin && actor) {
      loginApplicantMutate({ mobile, pin })
        .then(() => setSessionReady(true))
        .catch(() => setSessionReady(true)); // proceed even if re-login fails
    } else if (actor) {
      setSessionReady(true);
    }
  }, [mobile, pin, actor, navigate, loginApplicantMutate]);

  const {
    data: application,
    isLoading,
    refetch,
  } = useGetMyApplication(mobile, sessionReady);

  const handleLogout = () => {
    localStorage.removeItem("applicantMobile");
    localStorage.removeItem("applicantName");
    localStorage.removeItem("applicantPin");
    navigate({ to: "/admission/apply" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="navy-gradient py-8 px-4">
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

      <div className="max-w-2xl mx-auto px-4 py-8">
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
                        <FileText className="w-3 h-3" />
                        Passport Photo
                      </a>
                    )}
                    {application.incomeCertUrl && (
                      <a
                        href={application.incomeCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Income Certificate
                      </a>
                    )}
                    {application.casteCertUrl && (
                      <a
                        href={application.casteCertUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline font-body flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Caste Certificate
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
