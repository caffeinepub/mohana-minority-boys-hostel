import { Badge } from "@/components/ui/badge";
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
import { GraduationCap, Search, Users } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Student } from "../backend.d";
import { useGetAllStudents } from "../hooks/useQueries";

const FALLBACK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Mohammed Arif Khan",
    fatherName: "Abdul Karim Khan",
    classLevel: "Class 11 (Science)",
    rollNumber: "MS-2025-001",
    year: "2025",
    category: "Muslim",
    admissionDate: "2025-06-15",
  },
  {
    id: 2,
    name: "David Prakash Nayak",
    fatherName: "Samuel Nayak",
    classLevel: "Class 12 (Commerce)",
    rollNumber: "MS-2025-002",
    year: "2025",
    category: "Christian",
    admissionDate: "2025-06-15",
  },
  {
    id: 3,
    name: "Gurpreet Singh",
    fatherName: "Harjinder Singh",
    classLevel: "B.Sc. 1st Year",
    rollNumber: "MS-2025-003",
    year: "2025",
    category: "Sikh",
    admissionDate: "2025-07-01",
  },
  {
    id: 4,
    name: "Rahul Islam",
    fatherName: "Md. Nazrul Islam",
    classLevel: "Class 11 (Arts)",
    rollNumber: "MS-2025-004",
    year: "2025",
    category: "Muslim",
    admissionDate: "2025-07-01",
  },
  {
    id: 5,
    name: "Thomas John",
    fatherName: "Jacob John",
    classLevel: "B.A. 2nd Year",
    rollNumber: "MS-2025-005",
    year: "2025",
    category: "Christian",
    admissionDate: "2025-07-10",
  },
  {
    id: 6,
    name: "Sanjay Ansari",
    fatherName: "Md. Hakim Ansari",
    classLevel: "Class 12 (Science)",
    rollNumber: "MS-2025-006",
    year: "2025",
    category: "Muslim",
    admissionDate: "2025-07-12",
  },
];

const categoryColors: Record<string, string> = {
  Muslim: "bg-green-50 text-green-700 border-green-200",
  Christian: "bg-blue-50 text-blue-700 border-blue-200",
  Sikh: "bg-orange-50 text-orange-700 border-orange-200",
  Buddhist: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Parsi: "bg-purple-50 text-purple-700 border-purple-200",
  Jain: "bg-pink-50 text-pink-700 border-pink-200",
};

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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Enrolled",
              value: students.length,
              icon: Users,
              color: "text-primary",
            },
            {
              label: "Muslim",
              value: students.filter((s) => s.category === "Muslim").length,
              icon: GraduationCap,
              color: "text-green-600",
            },
            {
              label: "Christian",
              value: students.filter((s) => s.category === "Christian").length,
              icon: GraduationCap,
              color: "text-blue-600",
            },
            {
              label: "Other Communities",
              value: students.filter(
                (s) => !["Muslim", "Christian"].includes(s.category),
              ).length,
              icon: GraduationCap,
              color: "text-orange-600",
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

        {/* Search */}
        <div className="relative mb-6 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, class, roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 font-body text-sm"
          />
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
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden md:table-cell">
                      Father's Name
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden sm:table-cell">
                      Class
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden lg:table-cell">
                      Roll Number
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden lg:table-cell">
                      Year
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground">
                      Community
                    </TableHead>
                    <TableHead className="font-display font-semibold text-xs text-foreground hidden xl:table-cell">
                      Admission Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-10 text-muted-foreground font-body text-sm"
                      >
                        No students found matching your search.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((student, i) => {
                      const catColor =
                        categoryColors[student.category] ??
                        "bg-muted text-muted-foreground border-border";
                      return (
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
                          <TableCell className="text-xs text-muted-foreground font-body hidden md:table-cell">
                            {student.fatherName}
                          </TableCell>
                          <TableCell className="text-xs text-foreground font-body hidden sm:table-cell">
                            {student.classLevel}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-mono hidden lg:table-cell">
                            {student.rollNumber}
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell">
                            {student.year}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={`text-xs font-body ${catColor}`}
                            >
                              {student.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-body hidden xl:table-cell">
                            {student.admissionDate}
                          </TableCell>
                        </TableRow>
                      );
                    })
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
