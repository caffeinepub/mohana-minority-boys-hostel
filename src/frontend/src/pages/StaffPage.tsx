import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Phone, Star, User } from "lucide-react";
import { motion } from "motion/react";
import type { StaffMember } from "../backend.d";
import { useGetAllStaff } from "../hooks/useQueries";

const FALLBACK_STAFF: StaffMember[] = [
  {
    id: 1,
    name: "Mr. Rajesh Kumar Pradhan",
    designation: "Hostel Superintendent",
    role: "superintendent",
    phone: "9876543210",
    email: "superintendent@pmmbh-mohana.gov.in",
    bio: "Mr. Pradhan has been serving as the Hostel Superintendent for over 10 years, dedicated to providing a safe and conducive environment for minority students. Under his leadership, the hostel has seen significant improvements in academic outcomes.",
    photoUrl: "",
    order: BigInt(1),
  },
  {
    id: 2,
    name: "Mr. Suresh Nayak",
    designation: "Assistant Warden",
    role: "warden",
    phone: "9876543211",
    email: "warden@pmmbh-mohana.gov.in",
    bio: "Mr. Nayak assists the superintendent in day-to-day management of the hostel and welfare of students.",
    photoUrl: "",
    order: BigInt(2),
  },
  {
    id: 3,
    name: "Mr. Bikash Panda",
    designation: "Accounts Clerk",
    role: "accountant",
    phone: "9876543212",
    email: "accounts@pmmbh-mohana.gov.in",
    bio: "Mr. Panda manages the financial accounts including mess fee collection, scholarship disbursement records, and government fund management.",
    photoUrl: "",
    order: BigInt(3),
  },
  {
    id: 4,
    name: "Mr. Ramesh Sahu",
    designation: "Mess Manager",
    role: "cook",
    phone: "9876543213",
    email: "",
    bio: "Mr. Sahu oversees the hostel mess operations ensuring nutritious and hygienic meals are provided to all resident students.",
    photoUrl: "",
    order: BigInt(4),
  },
  {
    id: 5,
    name: "Mr. Duryodhan Bisoi",
    designation: "Security Guard",
    role: "guard",
    phone: "9876543214",
    email: "",
    bio: "Responsible for the security and safety of students and hostel premises round the clock.",
    photoUrl: "",
    order: BigInt(5),
  },
];

const roleColors: Record<string, string> = {
  superintendent:
    "bg-[oklch(var(--saffron)/0.15)] text-[oklch(var(--saffron))] border-[oklch(var(--saffron)/0.3)]",
  warden: "bg-blue-50 text-blue-700 border-blue-200",
  accountant: "bg-green-50 text-green-700 border-green-200",
  cook: "bg-orange-50 text-orange-700 border-orange-200",
  guard: "bg-purple-50 text-purple-700 border-purple-200",
  other: "bg-muted text-muted-foreground border-border",
};

function StaffAvatar({ member }: { member: StaffMember }) {
  if (member.photoUrl) {
    return (
      <img
        src={member.photoUrl}
        alt={member.name}
        className="w-full h-full object-cover"
      />
    );
  }
  return (
    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
      <User className="w-12 h-12 text-primary/40" />
    </div>
  );
}

function SuperintendentCard({ member }: { member: StaffMember }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10"
    >
      <Card className="overflow-hidden border-2 border-[oklch(var(--saffron)/0.5)] shadow-saffron">
        <div className="staff-card-superintendent p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Photo */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden border-2 border-[oklch(var(--saffron))] flex-shrink-0">
              <StaffAvatar member={member} />
            </div>
            {/* Info */}
            <div className="flex-1 text-center md:text-left text-white">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <Star className="w-5 h-5 text-[oklch(var(--saffron))]" />
                <Badge className="bg-[oklch(var(--saffron))] text-[oklch(0.10_0.02_260)] font-body text-xs">
                  Hostel Superintendent
                </Badge>
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-1">
                {member.name}
              </h2>
              <p className="text-white/70 font-body text-sm mb-4">
                {member.designation}
              </p>
              {member.bio && (
                <p className="text-white/80 font-body text-sm leading-relaxed mb-4 max-w-xl">
                  {member.bio}
                </p>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-2 text-[oklch(var(--saffron))] hover:text-white transition-colors text-sm font-body"
                  >
                    <Phone className="w-4 h-4" />
                    {member.phone}
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-[oklch(var(--saffron))] hover:text-white transition-colors text-sm font-body"
                  >
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function StaffCard({
  member,
  index,
}: {
  member: StaffMember;
  index: number;
}) {
  const roleColor = roleColors[member.role] ?? roleColors.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="h-full card-hover border-border shadow-xs">
        <CardContent className="p-0">
          <div className="h-40 overflow-hidden rounded-t-lg">
            <StaffAvatar member={member} />
          </div>
          <div className="p-5">
            <Badge
              variant="outline"
              className={`text-xs font-body mb-2 capitalize ${roleColor}`}
            >
              {member.role}
            </Badge>
            <h3 className="font-display font-bold text-base text-foreground mb-0.5">
              {member.name}
            </h3>
            <p className="text-muted-foreground text-xs font-body mb-3">
              {member.designation}
            </p>
            {member.bio && (
              <p className="text-muted-foreground text-xs font-body leading-relaxed mb-4 line-clamp-3">
                {member.bio}
              </p>
            )}
            <div className="space-y-1.5">
              {member.phone && (
                <a
                  href={`tel:${member.phone}`}
                  className="flex items-center gap-2 text-primary hover:underline text-xs font-body"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {member.phone}
                </a>
              )}
              {member.email && (
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-2 text-primary hover:underline text-xs font-body truncate"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {member.email}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StaffPage() {
  const { data: staffData, isLoading } = useGetAllStaff();

  const staff = staffData && staffData.length > 0 ? staffData : FALLBACK_STAFF;
  const superintendent = staff.find((s) => s.role === "superintendent");
  const otherStaff = staff
    .filter((s) => s.role !== "superintendent")
    .sort((a, b) => Number(a.order) - Number(b.order));

  return (
    <div>
      {/* Page Hero Banner */}
      <div className="hero-pattern py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="gold-rule w-8" />
            <span className="font-body text-[11px] tracking-[0.18em] uppercase text-[oklch(var(--saffron))] font-semibold">
              Our Team
            </span>
            <div className="gold-rule w-8" />
          </div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl text-white mb-3 tracking-tight">
            Staff Members
          </h1>
          <p className="text-white/60 font-body max-w-md mx-auto text-sm leading-relaxed">
            Dedicated professionals committed to the welfare and academic
            success of our students.
          </p>
        </motion.div>
      </div>

      <div className="py-10">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-56 w-full rounded-xl" />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-xl" />
                ))}
              </div>
            </div>
          ) : (
            <>
              {superintendent && <SuperintendentCard member={superintendent} />}
              {otherStaff.length > 0 && (
                <>
                  <h2 className="font-display font-semibold text-xl text-foreground mb-6 pb-2 border-b border-border">
                    Support Staff
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {otherStaff.map((member, i) => (
                      <StaffCard key={member.id} member={member} index={i} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
