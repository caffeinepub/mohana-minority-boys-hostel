import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  Award,
  BookOpen,
  Building2,
  ChevronRight,
  ExternalLink,
  GraduationCap,
  Home,
  IndianRupee,
  MapPin,
  Phone,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useGetAllStaff, useGetSiteSettings } from "../hooks/useQueries";

const features = [
  {
    icon: Home,
    title: "Free Accommodation",
    desc: "Government-funded free boarding and lodging for eligible minority students pursuing post-matric education.",
    color: "text-blue-400",
  },
  {
    icon: BookOpen,
    title: "Educational Support",
    desc: "Study room facilities, library access, and academic guidance to help students excel in their studies.",
    color: "text-green-400",
  },
  {
    icon: IndianRupee,
    title: "Minimal Fees",
    desc: "Only nominal mess fees apply. Hostel fees, electricity, and all other charges are borne by the Government of Odisha.",
    color: "text-[oklch(var(--saffron))]",
  },
  {
    icon: Award,
    title: "Scholarship Support",
    desc: "Students are assisted in applying for state and central government scholarships via the Odisha Scholarship Portal.",
    color: "text-purple-400",
  },
];

const stats = [
  { label: "Seats Available", value: "50+" },
  { label: "Students Enrolled", value: "45+" },
  { label: "Years of Service", value: "15+" },
  { label: "Scholarships Facilitated", value: "200+" },
];

export default function HomePage() {
  const { data: settings } = useGetSiteSettings();
  const { data: staff } = useGetAllStaff();

  const superintendent = staff?.find((s) => s.role === "superintendent");

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative hero-pattern min-h-[85vh] flex items-center py-16">
        {/* Decorative circles */}
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-[oklch(var(--saffron)/0.08)] blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[oklch(0.35_0.12_258/0.15)] blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-[oklch(var(--saffron)/0.2)] text-[oklch(var(--saffron))] border-[oklch(var(--saffron)/0.3)] mb-4 font-body text-xs px-3 py-1">
                  Government of Odisha Initiative
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-2"
              >
                Post Matric
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-[oklch(var(--saffron))] leading-tight mb-2"
              >
                Minority Boys
              </motion.h1>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6"
              >
                Hostel, Mohana
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-white/70 font-body text-base md:text-lg mb-8 max-w-lg leading-relaxed"
              >
                Empowering minority students through free accommodation, quality
                education support, and scholarship assistance — building
                brighter futures for Odisha.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-wrap gap-3"
              >
                <a
                  href={settings?.admissionLink || "/admission"}
                  target={settings?.admissionLink ? "_blank" : undefined}
                  rel="noopener noreferrer"
                >
                  <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold px-6 shadow-saffron">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Apply for Admission
                  </Button>
                </a>
                <a
                  href="https://scholarship.odisha.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-body font-semibold px-6"
                  >
                    <Award className="w-4 h-4 mr-2" />
                    Scholarship Portal
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Right: Hostel Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <img
                  src="/assets/generated/hostel-hero.dim_1200x600.jpg"
                  alt="Post Matric Minority Boys Hostel, Mohana"
                  className="w-full object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14_0.07_258/0.6)] to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 font-display font-semibold text-sm">
                    Mohana, Gajapati District, Odisha
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-[oklch(var(--saffron))]" />
                    <span className="text-white/60 text-xs font-body">
                      Odisha — 761015
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating stats card */}
              {superintendent && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="absolute -bottom-6 -right-4 md:right-4 bg-white rounded-xl p-3 shadow-xl border border-border max-w-[180px]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-display font-bold text-foreground leading-tight">
                        {superintendent.name}
                      </p>
                      <p className="text-xs text-muted-foreground font-body leading-tight">
                        Superintendent
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-[oklch(var(--saffron))] py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-display font-bold text-2xl md:text-3xl text-[oklch(0.10_0.02_260)]">
                  {stat.value}
                </p>
                <p className="text-xs font-body text-[oklch(0.25_0.05_260)] mt-0.5">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <Badge className="bg-primary/10 text-primary mb-4 font-body text-xs px-3 py-1 border-primary/20">
              About the Hostel
            </Badge>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-4">
              Everything Provided by Government
            </h2>
            <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm leading-relaxed">
              Under the SC &amp; ST Development &amp; Minorities &amp; Backward
              Classes Department, Government of Odisha.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Card className="h-full card-hover border-border shadow-xs">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center mb-4">
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-display font-semibold text-base text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-body leading-relaxed">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Scheme Banner */}
      <section className="py-16 navy-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Building2 className="w-12 h-12 mx-auto mb-4 text-[oklch(var(--saffron))]" />
              <h2 className="font-display font-bold text-3xl mb-4">
                About the Government Scheme
              </h2>
              <p className="text-white/80 font-body text-sm leading-relaxed mb-8 max-w-2xl mx-auto">
                The Post Matric Minority Boys Hostel at Mohana is established
                and maintained by the Government of Odisha under the{" "}
                <strong className="text-[oklch(var(--saffron))]">
                  Minority Hostel Scheme
                </strong>
                . It provides free accommodation to Muslim, Christian, Sikh,
                Buddhist, Parsi, and Jain students pursuing Class 11 and above
                education. All charges including rent, electricity, water, and
                maintenance are borne entirely by the state government. Only
                mess fees are charged to cover food expenses.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/admission">
                  <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold">
                    Apply Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link to="/fees">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 font-body"
                  >
                    View Fees Structure
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Access Cards */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="font-display font-bold text-2xl text-foreground text-center mb-10">
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Users,
                title: "Staff Directory",
                desc: "Meet our superintendent and support staff",
                href: "/staff",
                color: "bg-blue-50 text-blue-700",
              },
              {
                icon: GraduationCap,
                title: "Admissions Open",
                desc: "Apply for the new academic session",
                href: "/admission",
                color: "bg-green-50 text-green-700",
              },
              {
                icon: Award,
                title: "Scholarships",
                desc: "Apply on Odisha Scholarship Portal",
                href: "/scholarship",
                color: "bg-orange-50 text-orange-700",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <Link to={item.href}>
                  <Card className="group card-hover cursor-pointer border-border">
                    <CardContent className="p-6 flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110`}
                      >
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground text-sm font-body">
                          {item.desc}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display font-bold text-2xl text-foreground mb-8">
            Contact Us
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-sm text-foreground">
                  Address
                </p>
                <p className="text-muted-foreground text-xs font-body">
                  Mohana, Gajapati District, Odisha — 761015
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-sm text-foreground">
                  Phone
                </p>
                <p className="text-muted-foreground text-xs font-body">
                  +91 9876543210
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
