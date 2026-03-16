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
    accent: "feature-card-navy",
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
  {
    icon: BookOpen,
    title: "Educational Support",
    desc: "Study room facilities, library access, and academic guidance to help students excel in their studies.",
    accent: "feature-card-gold",
    iconBg: "bg-[oklch(var(--saffron)/0.12)]",
    iconColor: "text-[oklch(var(--saffron))]",
  },
  {
    icon: IndianRupee,
    title: "Minimal Fees",
    desc: "Only nominal mess fees apply. Hostel fees, electricity, and all other charges are borne by the Government of Odisha.",
    accent: "feature-card-navy",
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
  {
    icon: Award,
    title: "Scholarship Support",
    desc: "Students are assisted in applying for state and central government scholarships via the Odisha Scholarship Portal.",
    accent: "feature-card-gold",
    iconBg: "bg-[oklch(var(--saffron)/0.12)]",
    iconColor: "text-[oklch(var(--saffron))]",
  },
];

export default function HomePage() {
  const { data: settings } = useGetSiteSettings();
  const { data: staff } = useGetAllStaff();

  const superintendent = staff?.find((s) => s.role === "superintendent");

  return (
    <div className="overflow-hidden">
      {/* Hero Section — full-width background image with overlay */}
      <section className="relative min-h-[90vh] flex flex-col justify-end overflow-hidden">
        {/* Full-bleed background hostel image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/uploads/hostel-1.jpeg"
            alt="Post Matric Minority Boys Hostel, Mohana"
            className="w-full h-full object-cover object-center"
          />
          {/* Multi-layer overlay for depth and readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.07_260/0.65)] via-[oklch(0.14_0.07_258/0.55)] to-[oklch(0.10_0.06_260/0.88)]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.12_0.07_260/0.75)] via-transparent to-transparent" />
          {/* Subtle radial glow behind text */}
          <div className="absolute left-0 top-0 bottom-0 w-2/3 bg-gradient-to-r from-[oklch(0.15_0.08_260/0.6)] to-transparent pointer-events-none" />
        </div>

        {/* Decorative saffron glow orbs */}
        <div className="absolute top-16 right-20 w-72 h-72 rounded-full bg-[oklch(var(--saffron)/0.07)] blur-3xl pointer-events-none z-[1]" />
        <div className="absolute bottom-24 right-8 w-48 h-48 rounded-full bg-[oklch(0.35_0.12_258/0.2)] blur-2xl pointer-events-none z-[1]" />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-20 pt-28">
          <div className="max-w-3xl">
            {/* Logos row */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="flex items-center gap-3">
                <img
                  src="/assets/generated/hostel-logo-transparent.dim_200x200.png"
                  alt="PMMBH Mohana Emblem"
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-lg"
                />
              </div>
              <div className="h-12 w-px bg-white/20 hidden sm:block" />
              <div className="hidden sm:flex flex-col gap-1.5">
                <img
                  src="/assets/generated/odisha-govt-logo-transparent.dim_200x200.png"
                  alt="Odisha Government"
                  className="w-8 h-8 object-contain"
                />
                <img
                  src="/assets/generated/ministry-minority-affairs-logo-transparent.dim_200x200.png"
                  alt="Ministry of Minority Affairs"
                  className="w-8 h-8 object-contain"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="gold-rule w-8" />
              <span className="font-body text-xs tracking-[0.18em] uppercase text-[oklch(var(--saffron))] font-semibold">
                Government of Odisha Initiative
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.15 }}
              className="font-serif font-bold leading-[1.06] mb-4"
            >
              <span className="block text-white/90 text-3xl md:text-4xl lg:text-5xl tracking-tight drop-shadow-sm">
                Post Matric
              </span>
              <span
                className="block text-[oklch(var(--saffron))] text-4xl md:text-5xl lg:text-6xl tracking-tight drop-shadow-md"
                style={{ textShadow: "0 2px 20px oklch(0.72 0.18 58 / 0.4)" }}
              >
                Minority Boys
              </span>
              <span className="block text-white text-3xl md:text-4xl lg:text-5xl tracking-tight drop-shadow-sm">
                Hostel, Mohana
              </span>
            </motion.h1>

            {/* Gold ruled separator */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ transformOrigin: "left" }}
              className="gold-rule w-28 mb-5"
            />

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-white/75 font-body text-base md:text-lg mb-8 max-w-xl leading-relaxed"
            >
              Empowering minority students through free accommodation, quality
              education support, and scholarship assistance — building brighter
              futures for Odisha.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-6"
            >
              <a
                href={settings?.admissionLink || "/admission"}
                target={settings?.admissionLink ? "_blank" : undefined}
                rel="noopener noreferrer"
              >
                <Button className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] hover:bg-[oklch(0.65_0.16_65)] font-body font-semibold px-6 shadow-lg shadow-[oklch(var(--saffron)/0.35)] text-sm">
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
                  className="border-white/35 text-white bg-white/8 hover:bg-white/18 backdrop-blur-sm font-body font-semibold px-6 text-sm"
                >
                  <Award className="w-4 h-4 mr-2" />
                  Scholarship Portal
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              </a>
            </motion.div>

            {/* Location badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="flex items-center gap-2"
            >
              <MapPin className="w-3.5 h-3.5 text-[oklch(var(--saffron))]" />
              <span className="text-white/55 text-xs font-body tracking-wide">
                Mohana, Gajapati District, Odisha — 761015
              </span>
            </motion.div>
          </div>
        </div>

        {/* Superintendent floating card — positioned bottom-right */}
        {superintendent && (
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="absolute bottom-8 right-6 md:right-12 z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 max-w-[200px] shadow-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[oklch(var(--saffron)/0.2)] border border-[oklch(var(--saffron)/0.5)] flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-[oklch(var(--saffron))]" />
              </div>
              <div>
                <p className="text-xs font-display font-bold text-white leading-tight">
                  {superintendent.name}
                </p>
                <p className="text-[10px] text-white/60 font-body leading-tight mt-0.5">
                  Hostel Superintendent
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </section>

      {/* Stats Bar */}
      <section className="bg-[oklch(var(--saffron))] py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                label: "Seats Available",
                value: settings?.seatsAvailable ?? "50+",
              },
              {
                label: "Students Enrolled",
                value: settings?.studentsEnrolled ?? "45+",
              },
              {
                label: "Years of Service",
                value: settings?.yearsOfService ?? "15+",
              },
              {
                label: "Scholarships Facilitated",
                value: settings?.scholarshipsFacilitated ?? "200+",
              },
            ].map((stat, i) => (
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

      {/* Distinguished Leaders Section */}
      <section className="py-16 navy-gradient">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="h-px flex-1 max-w-[80px] bg-[oklch(var(--saffron)/0.4)]" />
              <span className="font-body text-[11px] tracking-[0.2em] uppercase text-[oklch(var(--saffron)/0.8)] font-semibold">
                Leadership &amp; Governance
              </span>
              <div className="h-px flex-1 max-w-[80px] bg-[oklch(var(--saffron)/0.4)]" />
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-white tracking-tight mb-2">
              Our Distinguished Leaders
            </h2>
            <div className="mx-auto w-24 gold-rule mt-3" />
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                img: "/assets/generated/india-pm.dim_200x200.jpg",
                name: "Shri Narendra Modi",
                title: "Hon'ble Prime Minister of India",
              },
              {
                img: "/assets/generated/minority-minister.dim_200x200.jpg",
                name: "Shri Kiren Rijiju",
                title: "Hon'ble Minister of Minority Affairs, Govt. of India",
              },
              {
                img: "/assets/uploads/images-88--1.jpeg",
                name: "Shri Mohan Charan Majhi",
                title: "Hon'ble Chief Minister of Odisha",
              },
              {
                img: "/assets/generated/obc-director-jugaleswari-dash.dim_300x300.jpg",
                name: "Smt Jugaleswari Dash",
                title: "OBC Director, Odisha",
              },
            ].map((leader, i) => (
              <motion.div
                key={leader.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.55 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="rounded-2xl overflow-hidden border-2 border-[oklch(var(--saffron)/0.5)] shadow-xl shadow-[oklch(0.10_0.05_260/0.5)] bg-white/5 backdrop-blur-sm p-5 w-full transition-all duration-300 hover:border-[oklch(var(--saffron))] hover:shadow-[0_8px_32px_oklch(var(--saffron)/0.25)] hover:-translate-y-1"
                  style={{
                    background:
                      "linear-gradient(145deg, oklch(0.22 0.08 258 / 0.6) 0%, oklch(0.16 0.06 258 / 0.8) 100%)",
                  }}
                >
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[oklch(var(--saffron)/0.7)] shadow-lg mx-auto">
                      <img
                        src={leader.img}
                        alt={leader.name}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    {/* Gold ring glow */}
                    <div className="absolute inset-0 rounded-full shadow-[0_0_20px_oklch(var(--saffron)/0.3)] pointer-events-none" />
                  </div>
                  <h3 className="font-display font-bold text-white text-sm leading-tight mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-[oklch(var(--saffron)/0.85)] text-xs font-body leading-snug">
                    {leader.title}
                  </p>
                </div>
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
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px flex-1 max-w-[60px] bg-border" />
              <span className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground font-semibold">
                About the Hostel
              </span>
              <div className="h-px flex-1 max-w-[60px] bg-border" />
            </div>
            <h2 className="font-serif font-bold text-3xl md:text-4xl text-foreground mb-4 tracking-tight">
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
                <Card
                  className={`h-full card-hover border-border shadow-xs rounded-xl overflow-hidden ${feature.accent}`}
                >
                  <CardContent className="p-6">
                    <div
                      className={`w-11 h-11 rounded-lg ${feature.iconBg} flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        className={`w-5 h-5 ${feature.iconColor}`}
                      />
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
              <h2 className="font-serif font-bold text-3xl mb-4 tracking-tight">
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
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px flex-1 max-w-[60px] bg-border" />
              <span className="font-body text-[11px] tracking-[0.18em] uppercase text-muted-foreground font-semibold">
                Quick Access
              </span>
              <div className="h-px flex-1 max-w-[60px] bg-border" />
            </div>
          </div>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-body font-semibold text-sm text-foreground">
                  ST &amp; SC Dev. Dept., Odisha
                </p>
                <a
                  href="https://stsc.odisha.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-xs font-body"
                  data-ocid="contact.link"
                >
                  stsc.odisha.gov.in
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
