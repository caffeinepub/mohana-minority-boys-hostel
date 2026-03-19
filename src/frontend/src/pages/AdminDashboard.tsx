import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Principal } from "@icp-sdk/core/principal";
import { Link } from "@tanstack/react-router";
import {
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  GraduationCap,
  Home,
  Images,
  IndianRupee,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Printer,
  Settings,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Upload,
  UserCog,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
// xlsx is loaded dynamically at runtime via CDN (not a bundled dependency)
import type {
  AdmissionApplication,
  FeesStructure,
  GalleryImage,
  SiteSettings,
  StaffMember,
  Student,
} from "../backend.d";
import { ApplicationStatus, UserRole } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddOrUpdateFees,
  useAddOrUpdateGalleryImage,
  useAddOrUpdateStaff,
  useAddOrUpdateStudent,
  useApproveApplication,
  useAssignUserRole,
  useBulkAddStudents,
  useDeleteAllStudents,
  useGetAllApplications,
  useGetAllFees,
  useGetAllGalleryImages,
  useGetAllStaff,
  useGetAllStudents,
  useGetSiteSettings,
  useRejectApplication,
  useRemoveFees,
  useRemoveGalleryImage,
  useRemoveStaff,
  useRemoveStudent,
  useUpdateSiteSettings,
} from "../hooks/useQueries";
import { useStorageUpload } from "../hooks/useStorageUpload";

// ────────────────────────────────────────────────────────────────────────────
// Safe ID generator — Nat16 range (1–65534) to avoid ICP integer overflow
// ────────────────────────────────────────────────────────────────────────────

function safeId(): number {
  return (Date.now() % 65000) + 1;
}

// ────────────────────────────────────────────────────────────────────────────
// Staff Management
// ────────────────────────────────────────────────────────────────────────────

const emptyStaff: StaffMember = {
  id: 0,
  name: "",
  designation: "",
  role: "other",
  phone: "",
  email: "",
  bio: "",
  photoUrl: "",
  order: BigInt(1),
};

function StaffManagement() {
  const { data: staff = [], isLoading } = useGetAllStaff();
  const addOrUpdate = useAddOrUpdateStaff();
  const remove = useRemoveStaff();
  const { uploadFile, uploading, progress } = useStorageUpload();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<StaffMember>(emptyStaff);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const openAdd = () => {
    setEditing({ ...emptyStaff, id: safeId() });
    setPhotoFile(null);
    setShowForm(true);
  };

  const openEdit = (s: StaffMember) => {
    setEditing({ ...s });
    setPhotoFile(null);
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!editing.name.trim() || !editing.designation.trim()) {
      toast.error("Name and designation are required");
      return;
    }
    let photoUrl = editing.photoUrl;
    if (photoFile) {
      const url = await uploadFile(photoFile);
      if (!url) return;
      photoUrl = url;
    }
    await addOrUpdate.mutateAsync({ ...editing, photoUrl });
    toast.success("Staff member saved!");
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await remove.mutateAsync(id);
    toast.success("Staff member removed");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Staff Management
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            {staff.length} staff member{staff.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary text-primary-foreground font-body gap-2"
        >
          <Plus className="w-4 h-4" /> Add Staff
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-body text-muted-foreground">
            Loading...
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-display text-xs font-semibold">
                  Name
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  Designation
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden md:table-cell">
                  Role
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                  Phone
                </TableHead>
                <TableHead className="font-display text-xs font-semibold w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground font-body text-sm"
                  >
                    No staff members added yet. Click "Add Staff" to get
                    started.
                  </TableCell>
                </TableRow>
              ) : (
                staff.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/30">
                    <TableCell className="font-body font-medium text-sm">
                      {s.name}
                    </TableCell>
                    <TableCell className="text-sm font-body text-muted-foreground">
                      {s.designation}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs font-body capitalize"
                      >
                        {s.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell">
                      {s.phone}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(s)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(s.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing.id === 0 ? "Add Staff Member" : "Edit Staff Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Full Name *</Label>
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Mr. Rajesh Kumar Pradhan"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Designation *</Label>
              <Input
                value={editing.designation}
                onChange={(e) =>
                  setEditing({ ...editing, designation: e.target.value })
                }
                placeholder="Hostel Superintendent"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Role</Label>
              <Select
                value={editing.role}
                onValueChange={(v) => setEditing({ ...editing, role: v })}
              >
                <SelectTrigger className="font-body text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "superintendent",
                    "warden",
                    "accountant",
                    "cook",
                    "guard",
                    "other",
                  ].map((r) => (
                    <SelectItem
                      key={r}
                      value={r}
                      className="font-body text-sm capitalize"
                    >
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Phone</Label>
              <Input
                value={editing.phone}
                onChange={(e) =>
                  setEditing({ ...editing, phone: e.target.value })
                }
                placeholder="9876543210"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Email</Label>
              <Input
                value={editing.email}
                onChange={(e) =>
                  setEditing({ ...editing, email: e.target.value })
                }
                placeholder="email@example.com"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Display Order</Label>
              <Input
                type="number"
                value={Number(editing.order)}
                onChange={(e) =>
                  setEditing({ ...editing, order: BigInt(e.target.value || 1) })
                }
                className="font-body text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Bio</Label>
              <Textarea
                value={editing.bio}
                onChange={(e) =>
                  setEditing({ ...editing, bio: e.target.value })
                }
                placeholder="Brief description about this staff member..."
                rows={3}
                className="font-body text-sm resize-none"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Photo</Label>
              {editing.photoUrl && !photoFile && (
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={editing.photoUrl}
                    alt="Current"
                    className="w-12 h-12 rounded-lg object-cover border border-border"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditing({ ...editing, photoUrl: "" })}
                    className="h-7 text-xs text-destructive"
                  >
                    <X className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
                className="font-body text-sm cursor-pointer"
              />
              {photoFile && (
                <p className="text-xs text-muted-foreground font-body">
                  Selected: {photoFile.name}
                </p>
              )}
              {uploading && (
                <div className="space-y-1">
                  <Progress value={progress} className="h-1.5" />
                  <p className="text-xs text-muted-foreground font-body">
                    {progress}% uploaded
                  </p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addOrUpdate.isPending || uploading}
              className="bg-primary text-primary-foreground font-body"
            >
              {addOrUpdate.isPending || uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            Are you sure you want to remove this staff member? This action
            cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={remove.isPending}
              className="font-body"
            >
              {remove.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Students Management
// ────────────────────────────────────────────────────────────────────────────

const emptyStudent: Student = {
  id: 0,
  name: "",
  fatherName: "",
  classLevel: "",
  rollNumber: "",
  year: "",
  category: "—",
  admissionDate: new Date().toISOString().split("T")[0],
};

// ── Excel column header normalizer ──────────────────────────────────────────

function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/[\s/()]+/g, " ");
}

function findCol(headers: string[], candidates: string[]): number {
  for (const cand of candidates) {
    const norm = cand.toLowerCase();
    const idx = headers.findIndex((h) => h === norm);
    if (idx !== -1) return idx;
  }
  return -1;
}

interface ParsedExcelRow {
  serial: string;
  name: string;
  classLevel: string;
  college: string;
  regNo: string;
  mobile: string;
  remarks: string;
}

// Minimal xlsx type shim for dynamic import
type XLSXModule = {
  read: (
    data: unknown,
    opts?: { type?: string },
  ) => {
    SheetNames: string[];
    Sheets: { [key: string]: unknown };
  };
  utils: {
    sheet_to_json: (
      sheet: unknown,
      opts?: { header?: number; defval?: string },
    ) => unknown[];
  };
};

function parseExcelFile(file: File): Promise<ParsedExcelRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        if (!data) throw new Error("Could not read file");

        // Dynamically load xlsx from CDN to avoid bundler issues
        let XLSX: XLSXModule;
        if ((window as unknown as { XLSX?: XLSXModule }).XLSX) {
          XLSX = (window as unknown as { XLSX: XLSXModule }).XLSX;
        } else {
          await new Promise<void>((res, rej) => {
            const s = document.createElement("script");
            s.src =
              "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";
            s.onload = () => res();
            s.onerror = () => rej(new Error("Failed to load xlsx library"));
            document.head.appendChild(s);
          });
          XLSX = (window as unknown as { XLSX: XLSXModule }).XLSX;
        }

        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) throw new Error("No sheets found in file");
        const sheet = workbook.Sheets[sheetName];
        const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
          header: 1,
          defval: "",
        }) as string[][];

        if (rows.length < 2) throw new Error("File has no data rows");

        const rawHeaders = rows[0].map((h) => normalizeHeader(String(h ?? "")));

        const serialIdx = findCol(rawHeaders, [
          "serial no",
          "serial number",
          "s no",
          "s.no",
          "sl no",
          "sl. no",
          "sno",
          "sr no",
        ]);
        const nameIdx = findCol(rawHeaders, [
          "name",
          "name of the students",
          "student name",
        ]);
        const classIdx = findCol(rawHeaders, [
          "class",
          "class level",
          "course",
        ]);
        const collegeIdx = findCol(rawHeaders, [
          "college",
          "college or university name",
          "college university",
          "university",
          "institution",
          "institution name",
        ]);
        const regIdx = findCol(rawHeaders, [
          "registration no",
          "hostel admission registration number",
          "reg no",
          "reg. no",
          "registration number",
          "admission no",
          "admission number",
        ]);
        const mobileIdx = findCol(rawHeaders, [
          "mobile",
          "mobile number",
          "phone",
          "phone number",
          "contact",
          "contact no",
        ]);
        const remarksIdx = findCol(rawHeaders, [
          "remarks",
          "remark",
          "note",
          "notes",
        ]);

        if (nameIdx === -1) {
          throw new Error(
            'Could not find "Name" column. Please check your Excel headers.',
          );
        }

        const parsed: ParsedExcelRow[] = [];
        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          const name = String(row[nameIdx] ?? "").trim();
          if (!name) continue; // skip empty rows
          parsed.push({
            serial:
              serialIdx >= 0 ? String(row[serialIdx] ?? "").trim() : String(i),
            name,
            classLevel: classIdx >= 0 ? String(row[classIdx] ?? "").trim() : "",
            college:
              collegeIdx >= 0 ? String(row[collegeIdx] ?? "").trim() : "",
            regNo: regIdx >= 0 ? String(row[regIdx] ?? "").trim() : "",
            mobile: mobileIdx >= 0 ? String(row[mobileIdx] ?? "").trim() : "",
            remarks:
              remarksIdx >= 0 ? String(row[remarksIdx] ?? "").trim() : "",
          });
        }

        if (parsed.length === 0)
          throw new Error("No valid student rows found in file");
        resolve(parsed);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsBinaryString(file);
  });
}

function downloadStudentsCSVAdmin(students: Student[]) {
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

function StudentsManagement() {
  const { data: students = [], isLoading } = useGetAllStudents();
  const addOrUpdate = useAddOrUpdateStudent();
  const remove = useRemoveStudent();
  const deleteAll = useDeleteAllStudents();
  const [showDeleteAll, setShowDeleteAll] = useState(false);
  const bulkAdd = useBulkAddStudents();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Student>(emptyStudent);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Excel upload state
  const [parsedRows, setParsedRows] = useState<ParsedExcelRow[]>([]);
  const [xlFile, setXlFile] = useState<File | null>(null);
  const xlInputRef = useRef<HTMLInputElement>(null);

  const openAdd = () => {
    setEditing({ ...emptyStudent, id: safeId() });
    setShowForm(true);
  };

  const openEdit = (s: Student) => {
    setEditing({ ...s });
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!editing.name.trim() || !editing.classLevel.trim()) {
      toast.error("Name and class are required");
      return;
    }
    await addOrUpdate.mutateAsync(editing);
    toast.success("Student saved!");
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await remove.mutateAsync(id);
    toast.success("Student removed");
    setDeleteId(null);
  };

  const handleDeleteAll = async () => {
    try {
      const toDelete = [...students];
      if (toDelete.length === 0) {
        toast.success("No student records to delete");
        setShowDeleteAll(false);
        return;
      }
      for (const student of toDelete) {
        await remove.mutateAsync(student.id);
      }
      toast.success(`All ${toDelete.length} student records deleted`);
      setShowDeleteAll(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete students",
      );
      setShowDeleteAll(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setXlFile(file);
    try {
      const rows = await parseExcelFile(file);
      setParsedRows(rows);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to parse Excel file",
      );
      setParsedRows([]);
      setXlFile(null);
      if (xlInputRef.current) xlInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    if (parsedRows.length === 0) return;
    const today = new Date().toISOString().split("T")[0];
    const newStudents: Student[] = parsedRows.map((row, index) => ({
      id: ((Date.now() % 60000) + (index % 5000) + 1) % 65534 || 1,
      name: row.name,
      classLevel: row.classLevel,
      fatherName: row.college,
      rollNumber: row.regNo,
      year: row.mobile,
      category: row.remarks || "—",
      admissionDate: today,
    }));

    try {
      await bulkAdd.mutateAsync(newStudents);
      toast.success(
        `${newStudents.length} student${newStudents.length !== 1 ? "s" : ""} imported successfully!`,
      );
      setParsedRows([]);
      setXlFile(null);
      if (xlInputRef.current) xlInputRef.current.value = "";
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Import failed. Please try again.",
      );
    }
  };

  const PREVIEW_LIMIT = 5;
  const previewRows = parsedRows.slice(0, PREVIEW_LIMIT);
  const extraCount = parsedRows.length - PREVIEW_LIMIT;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Students Management
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            {students.length} enrolled
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadStudentsCSVAdmin(students)}
            className="font-body text-xs gap-1.5"
            data-ocid="admin.students.download_button"
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="font-body text-xs gap-1.5"
            data-ocid="admin.students.print_button"
          >
            <Printer className="w-3.5 h-3.5" />
            Print
          </Button>
          <Button
            onClick={openAdd}
            className="bg-primary text-primary-foreground font-body gap-2"
          >
            <Plus className="w-4 h-4" /> Add Student
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDeleteAll(true)}
            className="font-body text-xs gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete All
          </Button>
        </div>
      </div>

      {/* Delete All Confirmation */}
      <Dialog open={showDeleteAll} onOpenChange={setShowDeleteAll}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display text-destructive">
              Delete All Students
            </DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            This will permanently delete <strong>all student records</strong>.
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteAll(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={deleteAll.isPending}
              className="font-body gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleteAll.isPending ? "Deleting..." : "Delete All"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Excel Upload Card ────────────────────────────────────────────── */}
      <Card className="border-border bg-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Upload className="w-4 h-4 text-primary" />
            Import Students from Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="font-body text-sm">
              Excel File (.xlsx, .xls, .csv)
            </Label>
            <div className="flex items-center gap-3 flex-wrap">
              <Input
                ref={xlInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="font-body text-sm cursor-pointer max-w-xs"
              />
              {xlFile && (
                <span className="text-xs text-muted-foreground font-body truncate max-w-[200px]">
                  {xlFile.name}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              Required columns:{" "}
              <span className="font-medium text-foreground">Name</span>, Class,
              College/University, Registration No., Mobile, Remarks. Data will
              be appended to existing students.
            </p>
          </div>

          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-body font-medium text-foreground">
                  Preview —{" "}
                  <span className="text-primary">{parsedRows.length} rows</span>{" "}
                  ready to import
                </p>
              </div>
              <div className="rounded-lg border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/60 hover:bg-muted/60">
                      <TableHead className="font-display text-xs font-semibold w-10">
                        S.No
                      </TableHead>
                      <TableHead className="font-display text-xs font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="font-display text-xs font-semibold hidden sm:table-cell">
                        Class
                      </TableHead>
                      <TableHead className="font-display text-xs font-semibold hidden md:table-cell">
                        College/University
                      </TableHead>
                      <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                        Reg. No.
                      </TableHead>
                      <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                        Mobile
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewRows.map((row, i) => (
                      <TableRow
                        key={`preview-${row.name}-${row.regNo || String(i)}`}
                        className="hover:bg-muted/30"
                      >
                        <TableCell className="text-xs text-muted-foreground font-body">
                          {row.serial || i + 1}
                        </TableCell>
                        <TableCell className="font-body font-medium text-sm">
                          {row.name}
                        </TableCell>
                        <TableCell className="text-xs font-body hidden sm:table-cell">
                          {row.classLevel || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-body text-muted-foreground hidden md:table-cell truncate max-w-[160px]">
                          {row.college || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-mono text-muted-foreground hidden lg:table-cell">
                          {row.regNo || "—"}
                        </TableCell>
                        <TableCell className="text-xs font-body text-muted-foreground hidden lg:table-cell">
                          {row.mobile || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                    {extraCount > 0 && (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-2 text-xs text-muted-foreground font-body italic"
                        >
                          … and {extraCount} more row
                          {extraCount !== 1 ? "s" : ""}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex gap-3 items-center">
                <Button
                  onClick={handleImport}
                  disabled={bulkAdd.isPending}
                  className="bg-primary text-primary-foreground font-body gap-2"
                >
                  {bulkAdd.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Importing…
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import {parsedRows.length} Student
                      {parsedRows.length !== 1 ? "s" : ""}
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setParsedRows([]);
                    setXlFile(null);
                    if (xlInputRef.current) xlInputRef.current.value = "";
                  }}
                  className="font-body text-xs text-muted-foreground"
                >
                  <X className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-body text-muted-foreground">
            Loading...
          </span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="rounded-xl border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="font-display text-xs font-semibold">
                    S.No.
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    Name
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    Class
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    College/University
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    Reg. No.
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    Mobile
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold">
                    Remarks
                  </TableHead>
                  <TableHead className="font-display text-xs font-semibold w-24">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground font-body text-sm"
                    >
                      No students added yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/30">
                      <TableCell className="text-xs font-body text-muted-foreground">
                        {students.indexOf(s) + 1}
                      </TableCell>
                      <TableCell className="font-body font-medium text-sm">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-xs font-body">
                        {s.classLevel || "—"}
                      </TableCell>
                      <TableCell className="text-sm font-body text-muted-foreground truncate max-w-[160px]">
                        {s.fatherName || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {s.rollNumber || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-body text-muted-foreground">
                        {s.year || "—"}
                      </TableCell>
                      <TableCell className="text-xs font-body text-muted-foreground">
                        {s.category || "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(s)}
                            className="h-8 w-8 p-0"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteId(s.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing.id === 0 ? "Add Student" : "Edit Student"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Full Name *</Label>
              <Input
                value={editing.name}
                onChange={(e) =>
                  setEditing({ ...editing, name: e.target.value })
                }
                placeholder="Mohammed Arif Khan"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Class/Level *</Label>
              <Input
                value={editing.classLevel}
                onChange={(e) =>
                  setEditing({ ...editing, classLevel: e.target.value })
                }
                placeholder="B.A. 1st Year"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">College/University</Label>
              <Input
                value={editing.fatherName}
                onChange={(e) =>
                  setEditing({ ...editing, fatherName: e.target.value })
                }
                placeholder="Berhampur University"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Registration No.</Label>
              <Input
                value={editing.rollNumber}
                onChange={(e) =>
                  setEditing({ ...editing, rollNumber: e.target.value })
                }
                placeholder="PMMB-2025-001"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Mobile Number</Label>
              <Input
                value={editing.year}
                onChange={(e) =>
                  setEditing({ ...editing, year: e.target.value })
                }
                placeholder="9876543210"
                className="font-body text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Remarks</Label>
              <Input
                value={editing.category}
                onChange={(e) =>
                  setEditing({ ...editing, category: e.target.value })
                }
                placeholder="Merit student / Any remarks"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Admission Date</Label>
              <Input
                type="date"
                value={editing.admissionDate}
                onChange={(e) =>
                  setEditing({ ...editing, admissionDate: e.target.value })
                }
                className="font-body text-sm"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addOrUpdate.isPending}
              className="bg-primary text-primary-foreground font-body"
            >
              {addOrUpdate.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            Remove this student record? This cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={remove.isPending}
              className="font-body"
            >
              {remove.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Fees Management
// ────────────────────────────────────────────────────────────────────────────

const emptyFee: FeesStructure = {
  id: 0,
  category: "Muslim",
  messFeesPerMonth: BigInt(800),
  period: "",
  notes: "",
};

function FeesManagement() {
  const { data: fees = [], isLoading } = useGetAllFees();
  const addOrUpdate = useAddOrUpdateFees();
  const remove = useRemoveFees();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<FeesStructure>(emptyFee);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [messFeesInput, setMessFeesInput] = useState("800");

  const openAdd = () => {
    setEditing({ ...emptyFee, id: safeId() });
    setMessFeesInput("800");
    setShowForm(true);
  };

  const openEdit = (f: FeesStructure) => {
    setEditing({ ...f });
    setMessFeesInput(f.messFeesPerMonth.toString());
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!editing.category.trim()) {
      toast.error("Category is required");
      return;
    }
    const messFeesNum = Number.parseInt(messFeesInput, 10);
    if (Number.isNaN(messFeesNum) || messFeesNum < 0) {
      toast.error("Enter a valid mess fee amount");
      return;
    }
    await addOrUpdate.mutateAsync({
      ...editing,
      messFeesPerMonth: BigInt(messFeesNum),
    });
    toast.success("Fees entry saved!");
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    await remove.mutateAsync(id);
    toast.success("Fees entry removed");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Fees Management
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            {fees.length} fee structure{fees.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="bg-primary text-primary-foreground font-body gap-2"
        >
          <Plus className="w-4 h-4" /> Add Fee Entry
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-body text-muted-foreground">
            Loading...
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-display text-xs font-semibold">
                  Community
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  Mess Fee/Month
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden md:table-cell">
                  Period
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                  Notes
                </TableHead>
                <TableHead className="font-display text-xs font-semibold w-24">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-muted-foreground font-body text-sm"
                  >
                    No fees entries yet.
                  </TableCell>
                </TableRow>
              ) : (
                fees.map((f) => (
                  <TableRow key={f.id} className="hover:bg-muted/30">
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-body">
                        {f.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-display font-bold text-[oklch(var(--saffron))]">
                      ₹{f.messFeesPerMonth.toString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-body hidden md:table-cell">
                      {f.period}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell max-w-xs truncate">
                      {f.notes}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(f)}
                          className="h-8 w-8 p-0"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(f.id)}
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editing.id === 0 ? "Add Fee Entry" : "Edit Fee Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Community *</Label>
              <Select
                value={editing.category}
                onValueChange={(v) => setEditing({ ...editing, category: v })}
              >
                <SelectTrigger className="font-body text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Muslim",
                    "Christian",
                    "Sikh",
                    "Buddhist",
                    "Parsi",
                    "Jain",
                  ].map((c) => (
                    <SelectItem key={c} value={c} className="font-body text-sm">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">
                Mess Fee per Month (₹)
              </Label>
              <Input
                type="number"
                value={messFeesInput}
                onChange={(e) => setMessFeesInput(e.target.value)}
                placeholder="800"
                className="font-body text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Period</Label>
              <Input
                value={editing.period}
                onChange={(e) =>
                  setEditing({ ...editing, period: e.target.value })
                }
                placeholder="June 2025 – May 2026"
                className="font-body text-sm"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label className="font-body text-sm">Notes</Label>
              <Textarea
                value={editing.notes}
                onChange={(e) =>
                  setEditing({ ...editing, notes: e.target.value })
                }
                placeholder="Additional notes about mess fees..."
                rows={2}
                className="font-body text-sm resize-none"
              />
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={addOrUpdate.isPending}
              className="bg-primary text-primary-foreground font-body"
            >
              {addOrUpdate.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Confirm Delete</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            Remove this fee entry? Cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={remove.isPending}
              className="font-body"
            >
              {remove.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Gallery Management
// ────────────────────────────────────────────────────────────────────────────

function GalleryManagement() {
  const { data: images = [], isLoading } = useGetAllGalleryImages();
  const addOrUpdate = useAddOrUpdateGalleryImage();
  const remove = useRemoveGalleryImage();
  const { uploadFile, uploading, progress } = useStorageUpload();
  const { identity } = useInternetIdentity();

  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const handleUpload = async () => {
    if (!imageFile) {
      toast.error("Please select an image file");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title for the image");
      return;
    }

    const url = await uploadFile(imageFile);
    if (!url) return;

    const newImage: GalleryImage = {
      id: safeId(),
      title: title.trim(),
      imageUrl: url,
      uploadedAt: BigInt(Date.now()),
      uploadedBy: identity?.getPrincipal().toString() ?? "admin",
    };

    await addOrUpdate.mutateAsync(newImage);
    toast.success("Image uploaded successfully!");
    setTitle("");
    setImageFile(null);
    // Reset file input
    const fileInput = document.getElementById(
      "gallery-file-input",
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const handleDelete = async (id: number) => {
    await remove.mutateAsync(id);
    toast.success("Image removed");
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          Gallery Management
        </h2>
        <p className="text-muted-foreground text-sm font-body">
          {images.length} images
        </p>
      </div>

      {/* Upload Form */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <Upload className="w-4 h-4" /> Upload New Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Image Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Annual Day Celebration 2025"
                className="font-body text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-body text-sm">Image File *</Label>
              <Input
                id="gallery-file-input"
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                className="font-body text-sm cursor-pointer"
              />
            </div>
          </div>
          {uploading && (
            <div className="mt-3 space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground font-body">
                {progress}% uploaded
              </p>
            </div>
          )}
          <Button
            onClick={handleUpload}
            disabled={
              uploading || addOrUpdate.isPending || !imageFile || !title
            }
            className="mt-4 bg-primary text-primary-foreground font-body gap-2"
          >
            {uploading || addOrUpdate.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploading ? "Uploading..." : "Saving..."}
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Upload Image
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-body text-muted-foreground">
            Loading...
          </span>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground font-body text-sm">
          No images uploaded yet. Use the form above to add photos.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative">
              <div className="aspect-square rounded-xl overflow-hidden border border-border">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="mt-1 text-xs font-body text-muted-foreground truncate">
                {img.title}
              </p>
              <button
                type="button"
                onClick={() => setDeleteId(img.id)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display">Delete Image</DialogTitle>
          </DialogHeader>
          <p className="font-body text-sm text-muted-foreground">
            Remove this image from the gallery? Cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              className="font-body"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={remove.isPending}
              className="font-body"
            >
              {remove.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Site Settings
// ────────────────────────────────────────────────────────────────────────────

function SiteSettingsPanel() {
  const { data: settings } = useGetSiteSettings();
  const updateSettings = useUpdateSiteSettings();

  const [form, setForm] = useState<SiteSettings>({
    admissionLink: "",
    scholarshipLink: "",
    announcementText: "",
    seatsAvailable: "50+",
    studentsEnrolled: "45+",
    yearsOfService: "15+",
    scholarshipsFacilitated: "200+",
  });

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (settings && !initialized) {
      setForm({
        admissionLink: settings.admissionLink ?? "",
        scholarshipLink: settings.scholarshipLink ?? "",
        announcementText: settings.announcementText ?? "",
        seatsAvailable: settings.seatsAvailable ?? "50+",
        studentsEnrolled: settings.studentsEnrolled ?? "45+",
        yearsOfService: settings.yearsOfService ?? "15+",
        scholarshipsFacilitated: settings.scholarshipsFacilitated ?? "200+",
      });
      setInitialized(true);
    }
  }, [settings, initialized]);

  const handleSave = async () => {
    await updateSettings.mutateAsync(form);
    toast.success("Site settings updated!");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          Site Settings
        </h2>
        <p className="text-muted-foreground text-sm font-body">
          Configure links and announcements for the public website.
        </p>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6 space-y-5">
          <div className="space-y-1.5">
            <Label className="font-body text-sm">
              Admission Application Link
            </Label>
            <Input
              value={form.admissionLink}
              onChange={(e) =>
                setForm({ ...form, admissionLink: e.target.value })
              }
              placeholder="https://odisha.gov.in/admission-portal"
              className="font-body text-sm"
            />
            <p className="text-xs text-muted-foreground font-body">
              URL for the government admission portal. Shown on Home and
              Admission pages.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Scholarship Portal Link</Label>
            <Input
              value={form.scholarshipLink}
              onChange={(e) =>
                setForm({ ...form, scholarshipLink: e.target.value })
              }
              placeholder="https://scholarship.odisha.gov.in/"
              className="font-body text-sm"
            />
            <p className="text-xs text-muted-foreground font-body">
              Link to the official scholarship portal. Shown on Scholarship
              page.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm">Announcement / Notice</Label>
            <Textarea
              value={form.announcementText}
              onChange={(e) =>
                setForm({ ...form, announcementText: e.target.value })
              }
              placeholder="Admissions for 2025-26 are now open. Apply before July 31, 2025..."
              rows={3}
              className="font-body text-sm resize-none"
            />
            <p className="text-xs text-muted-foreground font-body">
              This text appears as a scrolling announcement banner on all pages.
              Leave empty to hide.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label className="font-body text-sm font-semibold text-foreground">
              Homepage Stats
            </Label>
            <p className="text-xs text-muted-foreground font-body mb-3">
              These numbers appear in the stats bar on the homepage.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">
                  Seats Available
                </Label>
                <Input
                  value={form.seatsAvailable}
                  onChange={(e) =>
                    setForm({ ...form, seatsAvailable: e.target.value })
                  }
                  placeholder="50+"
                  className="font-body text-sm"
                  data-ocid="settings.seats_available.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">
                  Students Enrolled
                </Label>
                <Input
                  value={form.studentsEnrolled}
                  onChange={(e) =>
                    setForm({ ...form, studentsEnrolled: e.target.value })
                  }
                  placeholder="45+"
                  className="font-body text-sm"
                  data-ocid="settings.students_enrolled.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">
                  Years of Service
                </Label>
                <Input
                  value={form.yearsOfService}
                  onChange={(e) =>
                    setForm({ ...form, yearsOfService: e.target.value })
                  }
                  placeholder="15+"
                  className="font-body text-sm"
                  data-ocid="settings.years_of_service.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="font-body text-xs text-muted-foreground">
                  Scholarships Facilitated
                </Label>
                <Input
                  value={form.scholarshipsFacilitated}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      scholarshipsFacilitated: e.target.value,
                    })
                  }
                  placeholder="200+"
                  className="font-body text-sm"
                  data-ocid="settings.scholarships_facilitated.input"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={updateSettings.isPending}
            className="bg-primary text-primary-foreground font-body"
            data-ocid="settings.save_button"
          >
            {updateSettings.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Admin Registration Panel
// ────────────────────────────────────────────────────────────────────────────

function AdminRegistrationPanel() {
  const assignRole = useAssignUserRole();
  const [principalInput, setPrincipalInput] = useState("");

  const parsePrincipal = (): Principal | null => {
    const trimmed = principalInput.trim();
    if (!trimmed) {
      toast.error("Please enter a Principal ID");
      return null;
    }
    try {
      return Principal.fromText(trimmed);
    } catch {
      toast.error("Invalid Principal ID format. Please check and try again.");
      return null;
    }
  };

  const handleGrant = async () => {
    const principal = parsePrincipal();
    if (!principal) return;
    try {
      await assignRole.mutateAsync({ user: principal, role: UserRole.admin });
      toast.success("Admin access granted successfully!");
      setPrincipalInput("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to grant admin access",
      );
    }
  };

  const handleRevoke = async () => {
    const principal = parsePrincipal();
    if (!principal) return;
    try {
      await assignRole.mutateAsync({ user: principal, role: UserRole.user });
      toast.success("Admin access revoked. User downgraded to standard user.");
      setPrincipalInput("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to revoke admin access",
      );
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="font-display font-bold text-xl text-foreground">
          Admin Registration
        </h2>
        <p className="text-muted-foreground text-sm font-body">
          Grant or revoke admin access for other users of this hostel system.
        </p>
      </div>

      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-base flex items-center gap-2">
            <UserCog className="w-4 h-4 text-primary" />
            Manage Admin Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-lg bg-muted/60 border border-border p-4 space-y-1.5">
            <p className="text-sm font-body font-semibold text-foreground">
              How to find a Principal ID
            </p>
            <p className="text-xs font-body text-muted-foreground leading-relaxed">
              The Principal ID is the unique identifier shown after a user logs
              in via Internet Identity. Ask the user to visit the Admin Login
              page, sign in, and share the Principal ID displayed in the top
              header bar of the admin panel.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="font-body text-sm" htmlFor="principal-input">
              Principal ID *
            </Label>
            <Input
              id="principal-input"
              value={principalInput}
              onChange={(e) => setPrincipalInput(e.target.value)}
              placeholder="e.g. aaaaa-aa or xxxxx-xxxxx-xxxxx-xxxxx-cai"
              className="font-mono text-sm"
              disabled={assignRole.isPending}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGrant();
              }}
            />
            <p className="text-xs text-muted-foreground font-body">
              Paste the exact Principal ID as provided by the user.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Button
              onClick={handleGrant}
              disabled={assignRole.isPending || !principalInput.trim()}
              className="bg-primary text-primary-foreground font-body gap-2 flex-1"
            >
              {assignRole.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldCheck className="w-4 h-4" />
              )}
              {assignRole.isPending ? "Processing..." : "Grant Admin Access"}
            </Button>
            <Button
              onClick={handleRevoke}
              disabled={assignRole.isPending || !principalInput.trim()}
              variant="outline"
              className="font-body gap-2 flex-1 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              {assignRole.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ShieldOff className="w-4 h-4" />
              )}
              {assignRole.isPending ? "Processing..." : "Revoke Admin Access"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border border-dashed bg-muted/20">
        <CardContent className="pt-4 pb-4">
          <p className="text-xs text-muted-foreground font-body leading-relaxed">
            <span className="font-semibold text-foreground">Important:</span>{" "}
            Granting admin access gives the user full control over the hostel
            management system — staff, students, fees, gallery, and site
            settings. Only assign admin access to trusted personnel.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Applications Management
// ────────────────────────────────────────────────────────────────────────────

function statusBadge(status: ApplicationStatus) {
  if (status === ApplicationStatus.approved)
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-body">
        Approved
      </Badge>
    );
  if (status === ApplicationStatus.rejected)
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-body">
        Rejected
      </Badge>
    );
  return (
    <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-body">
      Pending
    </Badge>
  );
}

function formatTs(ts?: bigint): string {
  if (!ts) return "—";
  return new Date(Number(ts)).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ApplicationsManagement() {
  const { data: applications = [], isLoading } = useGetAllApplications();
  const approve = useApproveApplication();
  const reject = useRejectApplication();

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [viewApp, setViewApp] = useState<AdmissionApplication | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );

  const filtered = applications.filter((app) => {
    const matchStatus = statusFilter === "all" || app.status === statusFilter;
    const matchSearch =
      !search ||
      app.applicantName.toLowerCase().includes(search.toLowerCase()) ||
      app.applicantMobile.includes(search);
    return matchStatus && matchSearch;
  });

  const handleAction = async () => {
    if (!viewApp || !actionType) return;
    try {
      if (actionType === "approve") {
        await approve.mutateAsync({ id: viewApp.id, note: actionNote });
        toast.success("Application approved!");
      } else {
        await reject.mutateAsync({ id: viewApp.id, note: actionNote });
        toast.success("Application rejected.");
      }
      setViewApp(null);
      setActionType(null);
      setActionNote("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
    }
  };

  const pendingCount = applications.filter(
    (a) => a.status === ApplicationStatus.pending,
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-foreground">
            Admission Applications
          </h2>
          <p className="text-muted-foreground text-sm font-body">
            {applications.length} total ·{" "}
            <span className="text-amber-600 font-medium">
              {pendingCount} pending
            </span>
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or mobile..."
          className="font-body text-sm max-w-xs"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="font-body text-sm w-44">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-body text-sm">
              All Applications
            </SelectItem>
            <SelectItem value="pending" className="font-body text-sm">
              Pending
            </SelectItem>
            <SelectItem value="approved" className="font-body text-sm">
              Approved
            </SelectItem>
            <SelectItem value="rejected" className="font-body text-sm">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-body text-muted-foreground">
            Loading...
          </span>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-display text-xs font-semibold">
                  Name
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden sm:table-cell">
                  Mobile
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden md:table-cell">
                  Community
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                  Class
                </TableHead>
                <TableHead className="font-display text-xs font-semibold hidden lg:table-cell">
                  Submitted
                </TableHead>
                <TableHead className="font-display text-xs font-semibold">
                  Status
                </TableHead>
                <TableHead className="font-display text-xs font-semibold w-20">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground font-body text-sm"
                  >
                    No applications found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((app) => (
                  <TableRow key={app.id} className="hover:bg-muted/30">
                    <TableCell className="font-body font-medium text-sm">
                      {app.applicantName}
                    </TableCell>
                    <TableCell className="text-sm font-body text-muted-foreground hidden sm:table-cell">
                      {app.applicantMobile}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className="text-xs font-body capitalize"
                      >
                        {app.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-body hidden lg:table-cell">
                      {app.classYear}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-body hidden lg:table-cell">
                      {formatTs(app.submittedAt)}
                    </TableCell>
                    <TableCell>{statusBadge(app.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setViewApp(app);
                          setActionType(null);
                          setActionNote("");
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* View Application Dialog */}
      <Dialog
        open={!!viewApp}
        onOpenChange={(open) => !open && setViewApp(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {viewApp && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display">
                  Application — {viewApp.applicantName}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Status */}
                <div className="flex items-center gap-2">
                  {statusBadge(viewApp.status)}
                  <span className="text-xs text-muted-foreground font-body">
                    Submitted: {formatTs(viewApp.submittedAt)}
                  </span>
                  {viewApp.reviewedAt && (
                    <span className="text-xs text-muted-foreground font-body">
                      · Reviewed: {formatTs(viewApp.reviewedAt)}
                    </span>
                  )}
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[
                    { label: "Full Name", value: viewApp.applicantName },
                    { label: "Father's Name", value: viewApp.fatherName },
                    {
                      label: "Mobile",
                      value: `+91 ${viewApp.applicantMobile}`,
                    },
                    { label: "Date of Birth", value: viewApp.dateOfBirth },
                    { label: "Community", value: viewApp.category },
                    { label: "Annual Income", value: viewApp.annualIncome },
                    { label: "District", value: viewApp.district },
                    { label: "State", value: viewApp.state },
                    { label: "PIN Code", value: viewApp.pinCode },
                    { label: "Class/Year", value: viewApp.classYear },
                  ].map(({ label, value }) => (
                    <div key={label} className="space-y-0.5">
                      <p className="text-xs text-muted-foreground font-body">
                        {label}
                      </p>
                      <p className="font-body font-medium text-foreground text-sm">
                        {value || "—"}
                      </p>
                    </div>
                  ))}
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-xs text-muted-foreground font-body">
                      Address
                    </p>
                    <p className="font-body font-medium text-foreground text-sm">
                      {viewApp.address || "—"}
                    </p>
                  </div>
                  <div className="col-span-2 space-y-0.5">
                    <p className="text-xs text-muted-foreground font-body">
                      Institution
                    </p>
                    <p className="font-body font-medium text-foreground text-sm">
                      {viewApp.institutionName || "—"}
                    </p>
                  </div>
                </div>

                {/* Documents */}
                <div className="border-t border-border pt-3">
                  <p className="text-xs font-body font-semibold text-foreground mb-3">
                    Uploaded Documents
                  </p>
                  <div className="flex flex-wrap gap-4">
                    {viewApp.photoUrl && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-body">
                          Photo
                        </p>
                        <a
                          href={viewApp.photoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img
                            src={viewApp.photoUrl}
                            alt="Applicant portrait"
                            className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-80 transition-opacity"
                          />
                        </a>
                      </div>
                    )}
                    {viewApp.incomeCertUrl && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-body">
                          Income Certificate
                        </p>
                        <a
                          href={viewApp.incomeCertUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-body p-2 border border-border rounded-lg"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                    {viewApp.casteCertUrl && (
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-body">
                          Caste Certificate
                        </p>
                        <a
                          href={viewApp.casteCertUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs text-primary hover:underline font-body p-2 border border-border rounded-lg"
                        >
                          View Document
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Review note if any */}
                {viewApp.reviewNote && (
                  <div className="border-t border-border pt-3">
                    <p className="text-xs font-body font-semibold text-foreground mb-1">
                      Review Note
                    </p>
                    <p className="text-sm font-body text-muted-foreground">
                      {viewApp.reviewNote}
                    </p>
                  </div>
                )}

                {/* Approve / Reject */}
                {viewApp.status === ApplicationStatus.pending && (
                  <div className="border-t border-border pt-4 space-y-3">
                    {actionType ? (
                      <>
                        <Label className="font-body text-sm">
                          {actionType === "approve"
                            ? "Approval Note (optional)"
                            : "Rejection Reason *"}
                        </Label>
                        <Textarea
                          value={actionNote}
                          onChange={(e) => setActionNote(e.target.value)}
                          placeholder={
                            actionType === "approve"
                              ? "e.g. Report to hostel office by Aug 15..."
                              : "e.g. Income certificate not valid..."
                          }
                          rows={3}
                          className="font-body text-sm resize-none"
                        />
                        <div className="flex gap-3">
                          <Button
                            onClick={handleAction}
                            disabled={
                              approve.isPending ||
                              reject.isPending ||
                              (actionType === "reject" && !actionNote.trim())
                            }
                            className={`font-body gap-2 ${
                              actionType === "approve"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                            }`}
                          >
                            {approve.isPending || reject.isPending ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : actionType === "approve" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            Confirm{" "}
                            {actionType === "approve"
                              ? "Approval"
                              : "Rejection"}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setActionType(null);
                              setActionNote("");
                            }}
                            className="font-body"
                          >
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-3">
                        <Button
                          onClick={() => setActionType("approve")}
                          className="bg-green-600 hover:bg-green-700 text-white font-body gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => setActionType("reject")}
                          className="bg-red-600 hover:bg-red-700 text-white font-body gap-2"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setViewApp(null)}
                  className="font-body"
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Main Admin Dashboard
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { clear, identity } = useInternetIdentity();
  const { data: staff = [] } = useGetAllStaff();
  const { data: students = [] } = useGetAllStudents();
  const { data: images = [] } = useGetAllGalleryImages();
  const { data: applications = [] } = useGetAllApplications();

  const pendingApps = applications.filter(
    (a) => a.status === ApplicationStatus.pending,
  ).length;

  const handleLogout = () => {
    clear();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="navy-gradient border-b border-border/20 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[oklch(var(--saffron)/0.55)] shadow-[0_0_8px_oklch(var(--saffron)/0.25)] flex-shrink-0">
                <img
                  src="/assets/generated/hostel-logo-transparent.dim_200x200.png"
                  alt="PMMBH Mohana"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-display font-bold text-white text-sm">
                  Admin Dashboard
                </p>
                <p className="font-body text-white/50 text-xs">PMMBH Mohana</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {identity && (
                <p className="hidden md:block font-mono text-white/40 text-xs truncate max-w-[180px]">
                  {identity.getPrincipal().toString()}
                </p>
              )}
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 font-body text-xs gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" /> View Site
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/70 hover:text-white hover:bg-white/10 font-body text-xs gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Staff",
              value: staff.length,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Students",
              value: students.length,
              icon: GraduationCap,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Applications",
              value:
                pendingApps > 0
                  ? `${pendingApps} pending`
                  : applications.length,
              icon: ClipboardList,
              color: pendingApps > 0 ? "text-amber-600" : "text-purple-600",
              bg: pendingApps > 0 ? "bg-amber-50" : "bg-purple-50",
            },
            {
              label: "Gallery Photos",
              value: images.length,
              icon: Images,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
          ].map((stat) => (
            <Card key={stat.label} className="border-border shadow-xs">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-xs font-body">
                      {stat.label}
                    </p>
                    <p
                      className={`font-display font-bold text-xl ${stat.color}`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
                  >
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid grid-cols-7 mb-8 h-auto p-1 bg-muted/70 w-full overflow-x-auto">
            {[
              {
                value: "applications",
                icon: ClipboardList,
                label: "Applications",
              },
              { value: "staff", icon: Users, label: "Staff" },
              { value: "students", icon: GraduationCap, label: "Students" },
              { value: "fees", icon: IndianRupee, label: "Fees" },
              { value: "gallery", icon: Images, label: "Gallery" },
              { value: "settings", icon: Settings, label: "Settings" },
              { value: "admins", icon: UserCog, label: "Admins" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col sm:flex-row items-center gap-1 font-body text-xs py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm relative"
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.value === "applications" && pendingApps > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] flex items-center justify-center font-bold">
                    {pendingApps}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="applications">
            <ApplicationsManagement />
          </TabsContent>
          <TabsContent value="staff">
            <StaffManagement />
          </TabsContent>
          <TabsContent value="students">
            <StudentsManagement />
          </TabsContent>
          <TabsContent value="fees">
            <FeesManagement />
          </TabsContent>
          <TabsContent value="gallery">
            <GalleryManagement />
          </TabsContent>
          <TabsContent value="settings">
            <SiteSettingsPanel />
          </TabsContent>
          <TabsContent value="admins">
            <AdminRegistrationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
