import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetSiteSettings } from "../hooks/useQueries";

const eligibilityCriteria = [
  "Must belong to Muslim, Christian, Sikh, Buddhist, Parsi, or Jain communities",
  "Must be a permanent resident of Odisha state",
  "Must be a male student (Boys Hostel)",
  "Must be studying in Class 11 or above (Post Matric level)",
  "Annual family income must be below the prescribed limit (as per government norms)",
  "Must have valid income certificate and community certificate",
  "Must be enrolled in a recognized educational institution",
];

const documentsRequired = [
  "Completed admission application form",
  "Recent passport-size photographs (4 copies)",
  "Birth certificate / 10th mark sheet",
  "Community/Caste certificate (Muslim/Christian/Sikh/Buddhist/Parsi/Jain)",
  "Income certificate from competent authority",
  "Residence/Domicile certificate of Odisha",
  "School/College ID card or admission receipt",
  "Bank account passbook (for scholarship)",
  "Aadhar card (original + photocopy)",
];

const admissionSteps = [
  {
    step: "01",
    title: "Apply Online",
    desc: "Click the 'Apply for Admission' button and complete the online application form on the government portal.",
  },
  {
    step: "02",
    title: "Submit Documents",
    desc: "Upload all required documents including community certificate, income certificate, and academic records.",
  },
  {
    step: "03",
    title: "Verification",
    desc: "Documents will be verified by the hostel authority. You may be called for personal verification.",
  },
  {
    step: "04",
    title: "Allotment",
    desc: "Eligible students will receive seat allotment based on merit and availability. Join within the stipulated time.",
  },
];

export default function AdmissionPage() {
  const { data: settings } = useGetSiteSettings();
  const admissionLink = settings?.admissionLink || "https://www.odisha.gov.in/";

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge className="bg-primary/10 text-primary mb-4 font-body text-xs px-3 py-1 border-primary/20">
            Academic Session 2025–26
          </Badge>
          <h1 className="font-display font-bold text-4xl text-foreground mb-4">
            Admissions
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm leading-relaxed">
            Post Matric Minority Boys Hostel, Mohana invites applications from
            eligible minority male students for the new academic session.
          </p>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="navy-gradient rounded-2xl p-8 mb-10 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-[oklch(var(--saffron)/0.08)] rounded-full blur-3xl" />
          <GraduationCap className="w-14 h-14 mx-auto text-[oklch(var(--saffron))] mb-4" />
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Applications Now Open
          </h2>
          <p className="text-white/70 font-body text-sm mb-6 max-w-md mx-auto">
            Apply through the official Government of Odisha portal. Free
            accommodation for eligible minority students.
          </p>
          <a href={admissionLink} target="_blank" rel="noopener noreferrer">
            <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-bold px-8 py-3 text-base shadow-saffron">
              <ExternalLink className="w-5 h-5 mr-2" />
              Apply for Admission
            </Button>
          </a>
        </motion.div>

        {/* Important Notice */}
        <Alert className="mb-8 border-[oklch(var(--saffron)/0.4)] bg-[oklch(var(--saffron)/0.05)]">
          <AlertCircle className="h-4 w-4 text-[oklch(var(--saffron))]" />
          <AlertDescription className="font-body text-sm text-foreground">
            <strong>Important:</strong> Admission is completely free. All hostel
            charges, electricity, water, and maintenance are borne by the
            Government of Odisha. Only nominal mess fees apply for food
            expenses. Applications are accepted on a merit-cum-means basis.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          {/* Eligibility */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-700" />
                  </div>
                  <CardTitle className="font-display text-lg">
                    Eligibility Criteria
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {eligibilityCriteria.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm font-body text-foreground"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Documents */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-700" />
                  </div>
                  <CardTitle className="font-display text-lg">
                    Documents Required
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2.5">
                  {documentsRequired.map((item, i) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm font-body text-foreground"
                    >
                      <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-primary text-[9px] font-bold">
                          {i + 1}
                        </span>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* How to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
            How to Apply
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {admissionSteps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full border-border shadow-xs text-center">
                  <CardContent className="pt-6 p-5">
                    <div className="w-12 h-12 rounded-full navy-gradient flex items-center justify-center mx-auto mb-4">
                      <span className="font-display font-bold text-[oklch(var(--saffron))] text-sm">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-sm text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-xs font-body leading-relaxed">
                      {step.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Important Dates */}
        <Card className="border-border mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-700" />
              </div>
              <CardTitle className="font-display text-lg">
                Important Dates — 2025–26
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { label: "Application Start Date", date: "June 1, 2025" },
                { label: "Last Date to Apply", date: "July 31, 2025" },
                { label: "Document Verification", date: "August 1–10, 2025" },
                { label: "Admission/Joining Date", date: "August 15, 2025" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0"
                >
                  <span className="text-sm font-body text-foreground">
                    {item.label}
                  </span>
                  <Badge
                    variant="outline"
                    className="font-body text-xs text-primary border-primary/30 bg-primary/5"
                  >
                    {item.date}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <Alert className="border-border bg-muted/50">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="font-body text-sm text-muted-foreground">
            For admission-related queries, contact the Hostel Superintendent at
            +91 9876543210 or email pmmbh.mohana@odisha.gov.in. Walk-in
            inquiries accepted on all working days between 10 AM – 5 PM.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
