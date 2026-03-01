import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Nat16 "mo:core/Nat16";
import Principal "mo:core/Principal";

module {
  type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  type StaffMember = {
    id : Nat16;
    name : Text;
    designation : Text;
    role : Text;
    phone : Text;
    email : Text;
    bio : Text;
    photoUrl : Text;
    order : Nat;
  };

  type Student = {
    id : Nat16;
    name : Text;
    fatherName : Text;
    classLevel : Text;
    rollNumber : Text;
    year : Text;
    category : Text;
    admissionDate : Text;
  };

  type FeesStructure = {
    id : Nat16;
    category : Text;
    messFeesPerMonth : Nat;
    period : Text;
    notes : Text;
  };

  type GalleryImage = {
    id : Nat16;
    title : Text;
    imageUrl : Text;
    uploadedAt : Int;
    uploadedBy : Text;
  };

  type SiteSettings = {
    admissionLink : Text;
    scholarshipLink : Text;
    announcementText : Text;
  };

  type StudentApplicant = {
    mobile : Text;
    pinHash : Text;
    name : Text;
    createdAt : Int;
  };

  type AdmissionApplication = {
    id : Nat16;
    applicantMobile : Text;
    applicantName : Text;
    fatherName : Text;
    dateOfBirth : Text;
    address : Text;
    district : Text;
    state : Text;
    pinCode : Text;
    institutionName : Text;
    classYear : Text;
    category : Text;
    annualIncome : Text;
    photoUrl : Text;
    incomeCertUrl : Text;
    casteCertUrl : Text;
    status : ApplicationStatus;
    submittedAt : Int;
    reviewedAt : ?Int;
    reviewNote : Text;
  };

  type OldActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    staff : Map.Map<Nat16, StaffMember>;
    students : Map.Map<Nat16, Student>;
    fees : Map.Map<Nat16, FeesStructure>;
    gallery : Map.Map<Nat16, GalleryImage>;
    studentApplicants : Map.Map<Text, StudentApplicant>;
    applications : Map.Map<Nat16, AdmissionApplication>;
    applicantSessions : Map.Map<Principal, Text>;
    nextApplicationId : Nat;
    siteSettings : SiteSettings;
  };

  type NewActor = {
    userProfiles : Map.Map<Principal, { name : Text }>;
    staff : Map.Map<Nat16, StaffMember>;
    students : Map.Map<Nat16, Student>;
    fees : Map.Map<Nat16, FeesStructure>;
    gallery : Map.Map<Nat16, GalleryImage>;
    studentApplicants : Map.Map<Text, StudentApplicant>;
    applications : Map.Map<Nat16, AdmissionApplication>;
    applicantSessions : Map.Map<Principal, Text>;
    nextApplicationId : Nat;
    siteSettings : SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    old;
  };
};
