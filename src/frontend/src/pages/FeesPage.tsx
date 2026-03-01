import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertCircle,
  CheckCircle2,
  Droplets,
  Home,
  IndianRupee,
  Info,
  Shield,
  Utensils,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import type { FeesStructure } from "../backend.d";
import { useGetAllFees } from "../hooks/useQueries";

const FALLBACK_FEES: FeesStructure[] = [
  {
    id: 1,
    category: "Muslim",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
  {
    id: 2,
    category: "Christian",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
  {
    id: 3,
    category: "Sikh",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
  {
    id: 4,
    category: "Buddhist",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
  {
    id: 5,
    category: "Parsi",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
  {
    id: 6,
    category: "Jain",
    messFeesPerMonth: BigInt(800),
    period: "June 2025 – May 2026",
    notes: "Mess fee covers breakfast, lunch, and dinner on all days.",
  },
];

const freeFacilities = [
  { icon: Home, label: "Room / Accommodation", desc: "Free by Government" },
  { icon: Zap, label: "Electricity", desc: "Free by Government" },
  { icon: Droplets, label: "Water Supply", desc: "Free by Government" },
  { icon: Shield, label: "Security Services", desc: "Free by Government" },
  { icon: Utensils, label: "Mess Infrastructure", desc: "Free by Government" },
];

export default function FeesPage() {
  const { data: feesData, isLoading } = useGetAllFees();
  const fees = feesData && feesData.length > 0 ? feesData : FALLBACK_FEES;

  return (
    <div className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge className="bg-primary/10 text-primary mb-4 font-body text-xs px-3 py-1 border-primary/20">
            Government of Odisha
          </Badge>
          <h1 className="font-display font-bold text-4xl text-foreground mb-3">
            Fees Structure
          </h1>
          <p className="text-muted-foreground font-body max-w-xl mx-auto text-sm leading-relaxed">
            All hostel facilities are provided free of cost by the Government of
            Odisha. Only nominal mess fees are charged to cover food expenses.
          </p>
        </motion.div>

        {/* Big Green Notice */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-gradient-to-br from-green-600 to-green-700 p-8 mb-8 text-white text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
          <CheckCircle2 className="w-14 h-14 mx-auto mb-4 text-green-100" />
          <h2 className="font-display font-bold text-2xl mb-2">
            🎉 All Hostel Fees are FREE!
          </h2>
          <p className="text-green-100 font-body text-sm max-w-lg mx-auto leading-relaxed">
            The Government of Odisha bears the complete cost of accommodation,
            electricity, water, and all hostel maintenance. Only mess fees are
            collected from students.
          </p>
        </motion.div>

        {/* Free Facilities */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h2 className="font-display font-bold text-xl text-foreground mb-4">
            Facilities Provided Free by Government
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {freeFacilities.map((facility, i) => (
              <motion.div
                key={facility.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card className="text-center border-green-200 bg-green-50/50 shadow-xs">
                  <CardContent className="p-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                      <facility.icon className="w-5 h-5 text-green-700" />
                    </div>
                    <p className="font-body font-medium text-xs text-foreground leading-tight mb-1">
                      {facility.label}
                    </p>
                    <Badge className="bg-green-600 text-white text-xs font-body border-0">
                      FREE
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Mess Fees Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg bg-[oklch(var(--saffron)/0.15)] flex items-center justify-center">
                  <Utensils className="w-5 h-5 text-[oklch(var(--saffron))]" />
                </div>
                <CardTitle className="font-display text-lg">
                  Mess Fees Structure — 2025–26
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      <TableHead className="font-display font-semibold text-xs text-foreground">
                        Community
                      </TableHead>
                      <TableHead className="font-display font-semibold text-xs text-foreground">
                        Mess Fee (per month)
                      </TableHead>
                      <TableHead className="font-display font-semibold text-xs text-foreground hidden md:table-cell">
                        Period
                      </TableHead>
                      <TableHead className="font-display font-semibold text-xs text-foreground hidden lg:table-cell">
                        Notes
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fees.map((fee) => (
                      <TableRow
                        key={fee.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="font-body text-xs text-primary border-primary/30 bg-primary/5"
                          >
                            {fee.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-display font-bold text-lg text-[oklch(var(--saffron))]">
                            <IndianRupee className="w-4 h-4" />
                            {fee.messFeesPerMonth.toString()}
                            <span className="text-muted-foreground font-body text-xs font-normal ml-1">
                              /month
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body hidden md:table-cell">
                          {fee.period}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell max-w-xs">
                          {fee.notes}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Alerts */}
        <div className="space-y-4">
          <Alert className="border-[oklch(var(--saffron)/0.4)] bg-[oklch(var(--saffron)/0.05)]">
            <AlertCircle className="h-4 w-4 text-[oklch(var(--saffron))]" />
            <AlertDescription className="font-body text-sm text-foreground">
              <strong>Mess Fee Payment:</strong> Mess fees are to be paid
              monthly by the 10th of each month. Fee can be paid to the Mess
              Manager or through the designated account. Defaulters may lose
              mess facility temporarily.
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-200 bg-blue-50/50">
            <Info className="h-4 w-4 text-blue-700" />
            <AlertDescription className="font-body text-sm text-blue-800">
              <strong>Scholarship Benefit:</strong> Students receiving
              government scholarships through the Odisha State Scholarship
              Portal can use scholarship funds to pay mess fees. Apply for
              scholarship at{" "}
              <a
                href="https://scholarship.odisha.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold"
              >
                scholarship.odisha.gov.in
              </a>
            </AlertDescription>
          </Alert>

          <Alert className="border-green-200 bg-green-50/50">
            <CheckCircle2 className="h-4 w-4 text-green-700" />
            <AlertDescription className="font-body text-sm text-green-800">
              <strong>Government Guarantee:</strong> Under the Minority Hostel
              Scheme, the Government of Odisha guarantees free accommodation to
              all eligible minority students. No hidden charges or additional
              fees beyond mess.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  );
}
