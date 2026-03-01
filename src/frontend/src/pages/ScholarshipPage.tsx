import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Globe,
  IndianRupee,
  Info,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetSiteSettings } from "../hooks/useQueries";

const scholarshipTypes = [
  {
    name: "Pre & Post Matric Scholarship",
    authority: "National Minority Development & Finance Corporation",
    amount: "Up to ₹7,000 per year",
    eligibility: "Muslim, Christian, Sikh, Buddhist, Parsi, Jain students",
    color: "border-blue-200 bg-blue-50/50",
    badgeColor: "bg-blue-600",
  },
  {
    name: "Odisha State Post Matric Scholarship",
    authority: "SC & ST Dev. & Minorities Dept., Govt. of Odisha",
    amount: "Varies by class/institution",
    eligibility: "Minority students of Odisha, Post Matric level",
    color: "border-green-200 bg-green-50/50",
    badgeColor: "bg-green-600",
  },
  {
    name: "Merit-cum-Means Scholarship",
    authority: "Ministry of Minority Affairs, Govt. of India",
    amount: "Up to ₹30,000 per year",
    eligibility: "Minority students with 50%+ marks, family income < ₹2.5L",
    color: "border-orange-200 bg-orange-50/50",
    badgeColor: "bg-orange-600",
  },
  {
    name: "Maulana Azad National Scholarship",
    authority: "Maulana Azad Education Foundation",
    amount: "Up to ₹12,000 per year",
    eligibility: "Girls from minority communities (Class 11–12)",
    color: "border-purple-200 bg-purple-50/50",
    badgeColor: "bg-purple-600",
  },
];

const applicationSteps = [
  {
    step: "01",
    icon: Globe,
    title: "Visit Portal",
    desc: 'Go to scholarship.odisha.gov.in and click "New Registration" if applying for the first time.',
  },
  {
    step: "02",
    icon: FileText,
    title: "Register & Fill Form",
    desc: "Complete the online application form with accurate academic and personal details.",
  },
  {
    step: "03",
    icon: BookOpen,
    title: "Upload Documents",
    desc: "Upload required documents: marksheet, income certificate, community certificate, bank details.",
  },
  {
    step: "04",
    icon: CheckCircle2,
    title: "Institution Verification",
    desc: "Get the application verified by your school/college principal or hostel superintendent.",
  },
  {
    step: "05",
    icon: IndianRupee,
    title: "Receive Scholarship",
    desc: "Upon approval, scholarship amount is directly transferred to your bank account via DBT.",
  },
];

export default function ScholarshipPage() {
  const { data: settings } = useGetSiteSettings();
  const portalLink =
    settings?.scholarshipLink || "https://scholarship.odisha.gov.in/";

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
            Government of Odisha
          </Badge>
          <h1 className="font-display font-bold text-4xl text-foreground mb-4">
            Scholarship Portal
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm leading-relaxed">
            Apply for government scholarships designed to support minority
            students in continuing their education.
          </p>
        </motion.div>

        {/* Main CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="navy-gradient rounded-2xl p-8 mb-10 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[oklch(var(--saffron)/0.05)] pointer-events-none" />
          <Award className="w-16 h-16 mx-auto text-[oklch(var(--saffron))] mb-4" />
          <h2 className="font-display font-bold text-2xl text-white mb-2">
            Odisha State Scholarship Portal
          </h2>
          <p className="text-white/70 font-body text-sm mb-3 max-w-lg mx-auto">
            The official portal for all government scholarship schemes for
            minority, SC, ST and OBC students of Odisha.
          </p>
          <p className="font-mono text-[oklch(var(--saffron))] text-sm mb-6">
            scholarship.odisha.gov.in
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={portalLink} target="_blank" rel="noopener noreferrer">
              <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-bold px-8 shadow-saffron">
                <ExternalLink className="w-4 h-4 mr-2" />
                Apply for Scholarship
              </Button>
            </a>
            <a href={portalLink} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 font-body"
              >
                Check Application Status
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Scholarship Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-6">
            Available Scholarships
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {scholarshipTypes.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full border ${s.color} shadow-xs`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="font-display text-sm text-foreground leading-tight">
                        {s.name}
                      </CardTitle>
                      <Badge
                        className={`${s.badgeColor} text-white text-xs font-body flex-shrink-0 border-0`}
                      >
                        Active
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-xs font-body">
                      {s.authority}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                        <span className="text-xs font-body text-foreground font-semibold">
                          {s.amount}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-body text-muted-foreground">
                          {s.eligibility}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How to Apply */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-2xl text-foreground mb-6 text-center">
            How to Apply for Scholarship
          </h2>
          <div className="relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-8 right-8 h-0.5 bg-border" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 relative">
              {applicationSteps.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full navy-gradient flex items-center justify-center mx-auto mb-3 border-2 border-[oklch(var(--saffron)/0.3)] relative z-10">
                    <step.icon className="w-6 h-6 text-[oklch(var(--saffron))]" />
                  </div>
                  <p className="font-display font-bold text-xs text-primary mb-1">
                    Step {step.step}
                  </p>
                  <p className="font-display font-semibold text-xs text-foreground mb-1">
                    {step.title}
                  </p>
                  <p className="text-muted-foreground text-xs font-body leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Key Dates */}
        <Card className="border-border mb-8">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-700" />
              </div>
              <CardTitle className="font-display text-lg">
                Key Dates — 2025–26
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                {
                  event: "Portal opens for fresh applications",
                  date: "July 1, 2025",
                },
                {
                  event: "Last date for fresh applications",
                  date: "September 30, 2025",
                },
                {
                  event: "Renewal application period",
                  date: "August 1 – October 31, 2025",
                },
                {
                  event: "Institution verification deadline",
                  date: "November 30, 2025",
                },
                {
                  event: "Expected disbursal (1st installment)",
                  date: "December 2025",
                },
              ].map((item) => (
                <div
                  key={item.event}
                  className="flex justify-between items-center py-2 border-b border-border last:border-0 gap-4"
                >
                  <span className="text-sm font-body text-foreground">
                    {item.event}
                  </span>
                  <Badge
                    variant="outline"
                    className="font-body text-xs text-primary border-primary/30 bg-primary/5 flex-shrink-0"
                  >
                    {item.date}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <Alert className="border-border bg-muted/50">
          <Info className="h-4 w-4 text-muted-foreground" />
          <AlertDescription className="font-body text-sm text-muted-foreground">
            For scholarship application assistance, contact the Hostel
            Superintendent. We help students with document preparation and
            submission. Students are encouraged to apply as early as possible to
            ensure timely processing.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
