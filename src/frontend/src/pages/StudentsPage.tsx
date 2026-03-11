import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, GraduationCap, Printer, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Student } from "../backend.d";
import { useGetAllStudents } from "../hooks/useQueries";

function downloadStudentsCSV(students: Student[]) {
  const header = [
    "S.No.",
    "Name",
    "Class",
    "College/University",
    "Registration No.",
    "Mobile",
    "Remarks",
  ];
  const rows = students.map((s, i) => [
    String(i + 1),
    s.name,
    s.classLevel,
    s.fatherName,
    s.rollNumber,
    s.year,
    s.category,
  ]);
  const csvContent = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.csv";
  a.click();
  URL.revokeObjectURL(url);
}

const FALLBACK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Mohammed Arif Khan",
    fatherName: "Khallikote University",
    classLevel: "B.A. 1st Year",
    rollNumber: "PMMB-2025-001",
    year: "9876543210",
    category: "—",
    admissionDate: "2025-06-15",
  },
  {
    id: 2,
    name: "David Prakash Nayak",
    fatherName: "Berhampur University",
    classLevel: "B.Sc. 2nd Year",
    rollNumber: "PMMB-2025-002",
    year: "9876543211",
    category: "—",
    admissionDate: "2025-06-15",
  },
  {
    id: 3,
    name: "Gurpreet Singh",
    fatherName: "GIET College Gunupur",
    classLevel: "Class 12 (Science)",
    rollNumber: "PMMB-2025-003",
    year: "9876543212",
    category: "Merit student",
    admissionDate: "2025-07-01",
  },
];

export default function StudentsPage() {
  const { data: studentsData, isLoading } = useGetAllStudents();
  const [search, setSearch] = useState("");

  const students =
    studentsData && studentsData.length > 0 ? studentsData : FALLBACK_STUDENTS;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.classLevel.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.fatherName.toLowerCase().includes(q) ||
        s.year.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }, [students, search]);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <Badge className="bg-primary/10 text-primary mb-4 font-body text-xs px-3 py-1 border-primary/20">
            Academic Year 2025–26
          </Badge>
          <h1 className="font-display font-bold text-4xl text-foreground mb-3">
            Enrolled Students
          </h1>
          <p className="text-muted-foreground font-body max-w-md mx-auto text-sm">
            Current residents of Post Matric Minority Boys Hostel, Mohana.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8 max-w-sm mx-auto sm:max-w-none sm:grid-cols-2 md:w-fit md:mx-0">
          {[
            {
              label: "Total Enrolled",
              value: students.length,
              icon: Users,
              color: "text-primary",
            },
            {
              label: "With Class Info",
              value: students.filter((s) => !!s.classLevel).length,
              icon: GraduationCap,
              color: "text-green-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="border-border shadow-xs">
                <CardContent className="p-4 text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p
                    className={`font-display font-bold text-2xl ${stat.color}`}
                  >
                    {isLoading ? "—" : stat.value}
                  </p>
                  <p className="text-muted-foreground text-xs font-body">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, class, registration no., mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 font-body text-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadStudentsCSV(filtered)}
              className="font-body text-xs gap-1.5"
              data-ocid="students.download_button"
            >
              <Download className="w-3.5 h-3.5" />
              Download List
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="font-body text-xs gap-1.5"
              data-ocid="students.print_button"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </Button>
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-xl border border-border overflow-hidden shadow-xs">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/60 hover:bg-muted/60">
                    <TableHead className="font-display font-semibold text-xs text-foreground w-12">
                      S.No.
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground">
                      Name
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden sm:table-cell">
                      Class
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden md:table-cell">
                      College/University
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden lg:table-cell">
                      Registration No.
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden lg:table-cell">
                      Mobile
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden xl:table-cell">
                      Remarks
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-muted-foreground font-body text-sm"
                      >
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((student, i) => (
                      <TableRow
                        key={student.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <TableCell className="text-xs text-muted-foreground font-body">
                          {i + 1}
                        </TableCell>
                        <TableCell className="font-body font-medium text-sm text-foreground">
                          {student.name}
                        </TableCell>
                        <TableCell className="text-xs text-foreground font-body hidden sm:table-cell">
                          {student.classLevel || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body hidden md:table-cell">
                          {student.fatherName || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-mono hidden lg:table-cell">
                          {student.rollNumber || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell">
                          {student.year || "—"}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground font-body hidden xl:table-cell">
                          {student.category || "—"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-muted-foreground font-body mt-3">
              Showing {filtered.length} of {students.length} students
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
