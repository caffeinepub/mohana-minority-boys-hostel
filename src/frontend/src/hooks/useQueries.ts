import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FeesStructure,
  GalleryImage,
  SiteSettings,
  StaffMember,
  Student,
  UserRole,
} from "../backend.d";
import { useActor } from "./useActor";

// ─── Staff ───────────────────────────────────────────────────────────────────

export function useGetAllStaff() {
  const { actor, isFetching } = useActor();
  return useQuery<StaffMember[]>({
    queryKey: ["staff"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStaff();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
  });
}

export function useAddOrUpdateStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (staffMember: StaffMember) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateStaff(staffMember);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

export function useRemoveStaff() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeStaff(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff"] }),
  });
}

// ─── Students ─────────────────────────────────────────────────────────────────

export function useGetAllStudents() {
  const { actor, isFetching } = useActor();
  return useQuery<Student[]>({
    queryKey: ["students"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllStudents();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
  });
}

export function useAddOrUpdateStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (student: Student) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateStudent(student);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useRemoveStudent() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeStudent(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

export function useBulkAddStudents() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (students: Student[]) => {
      if (!actor) throw new Error("Not connected");
      return actor.bulkAddStudents(students);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["students"] }),
  });
}

// ─── Fees ────────────────────────────────────────────────────────────────────

export function useGetAllFees() {
  const { actor, isFetching } = useActor();
  return useQuery<FeesStructure[]>({
    queryKey: ["fees"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFees();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
  });
}

export function useAddOrUpdateFees() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (fee: FeesStructure) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateFees(fee);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fees"] }),
  });
}

export function useRemoveFees() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeFees(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["fees"] }),
  });
}

// ─── Gallery ─────────────────────────────────────────────────────────────────

export function useGetAllGalleryImages() {
  const { actor, isFetching } = useActor();
  return useQuery<GalleryImage[]>({
    queryKey: ["gallery"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllGalleryImages();
    },
    enabled: !!actor && !isFetching,
    staleTime: 60 * 1000,
  });
}

export function useAddOrUpdateGalleryImage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (image: GalleryImage) => {
      if (!actor) throw new Error("Not connected");
      return actor.addOrUpdateGalleryImage(image);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

export function useRemoveGalleryImage() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      if (!actor) throw new Error("Not connected");
      return actor.removeGalleryImage(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] }),
  });
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export function useGetSiteSettings() {
  const { actor, isFetching } = useActor();
  return useQuery<SiteSettings | null>({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSiteSettings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSiteSettings() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: SiteSettings) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateSiteSettings(settings);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["siteSettings"] }),
  });
}

// ─── Admin Check ─────────────────────────────────────────────────────────────

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch {
        return false;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
  });
}

// ─── Admin Role Assignment ────────────────────────────────────────────────────

export function useAssignUserRole() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({ user, role }: { user: Principal; role: UserRole }) => {
      if (!actor) throw new Error("Not connected");
      return actor.assignCallerUserRole(user, role);
    },
  });
}

// ─── Applicant Auth ───────────────────────────────────────────────────────────

export function useRegisterApplicant() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      mobile,
      pin,
      name,
    }: {
      mobile: string;
      pin: string;
      name: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.registerApplicant(mobile, pin, name);
    },
  });
}

export function useLoginApplicant() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      mobile,
      pin,
    }: {
      mobile: string;
      pin: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.loginApplicant(mobile, pin);
    },
  });
}

// ─── Admission Applications ───────────────────────────────────────────────────

import type { AdmissionApplication } from "../backend.d";

export function useSubmitApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (application: AdmissionApplication) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitApplication(application);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myApplication"] }),
  });
}

export function useGetMyApplication(mobile: string, sessionReady = true) {
  const { actor, isFetching } = useActor();
  return useQuery<AdmissionApplication | null>({
    queryKey: ["myApplication", mobile],
    queryFn: async () => {
      if (!actor || !mobile) return null;
      try {
        return await actor.getMyApplication(mobile);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!mobile && sessionReady,
    staleTime: 30 * 1000,
  });
}

export function useGetAllApplications() {
  const { actor, isFetching } = useActor();
  return useQuery<AdmissionApplication[]>({
    queryKey: ["allApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllApplications();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30 * 1000,
  });
}

export function useApproveApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: number; note: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.approveApplication(id, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allApplications"] }),
  });
}

export function useRejectApplication() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, note }: { id: number; note: string }) => {
      if (!actor) throw new Error("Not connected");
      return actor.rejectApplication(id, note);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allApplications"] }),
  });
}
