import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface StaffMember {
    id: number;
    bio: string;
    order: bigint;
    name: string;
    designation: string;
    role: string;
    photoUrl: string;
    email: string;
    phone: string;
}
export interface SiteSettings {
    announcementText: string;
    admissionLink: string;
    scholarshipLink: string;
}
export type Time = bigint;
export interface GalleryImage {
    id: number;
    title: string;
    imageUrl: string;
    uploadedAt: Time;
    uploadedBy: string;
}
export interface FeesStructure {
    id: number;
    period: string;
    messFeesPerMonth: bigint;
    notes: string;
    category: string;
}
export interface UserProfile {
    name: string;
}
export interface Student {
    id: number;
    admissionDate: string;
    name: string;
    year: string;
    fatherName: string;
    rollNumber: string;
    category: string;
    classLevel: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrUpdateFees(feesStructure: FeesStructure): Promise<void>;
    addOrUpdateGalleryImage(image: GalleryImage): Promise<void>;
    addOrUpdateStaff(staffMember: StaffMember): Promise<void>;
    addOrUpdateStudent(student: Student): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getAllFees(): Promise<Array<FeesStructure>>;
    getAllGalleryImages(): Promise<Array<GalleryImage>>;
    getAllStaff(): Promise<Array<StaffMember>>;
    getAllStudents(): Promise<Array<Student>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFees(id: number): Promise<FeesStructure>;
    getGalleryImage(id: number): Promise<GalleryImage>;
    getSiteSettings(): Promise<SiteSettings>;
    getStaffMember(id: number): Promise<StaffMember>;
    getStudent(id: number): Promise<Student>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    removeFees(id: number): Promise<void>;
    removeGalleryImage(id: number): Promise<void>;
    removeStaff(id: number): Promise<void>;
    removeStudent(id: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateSiteSettings(newSettings: SiteSettings): Promise<void>;
}
