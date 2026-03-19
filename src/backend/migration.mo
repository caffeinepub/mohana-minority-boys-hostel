import Map "mo:core/Map";
import Nat16 "mo:core/Nat16";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

module {
  // Old types
  type OldSiteSettings = {
    admissionLink : Text;
    scholarshipLink : Text;
    announcementText : Text;
  };

  type OldAdmissionApplication = {
    // Existing fields
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
    status : { #pending; #approved; #rejected };
    submittedAt : Time.Time;
    reviewedAt : ?Time.Time;
    reviewNote : Text;
  };

  type OldActor = {
    // Persistent data structures
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
    staff : Map.Map<Nat16, { id : Nat16; name : Text; designation : Text; role : Text; phone : Text; email : Text; bio : Text; photoUrl : Text; order : Nat }>;
    students : Map.Map<Nat16, { id : Nat16; name : Text; fatherName : Text; classLevel : Text; rollNumber : Text; year : Text; category : Text; admissionDate : Text }>;
    fees : Map.Map<Nat16, { id : Nat16; category : Text; messFeesPerMonth : Nat; period : Text; notes : Text }>;
    gallery : Map.Map<Nat16, { id : Nat16; title : Text; imageUrl : Text; uploadedAt : Time.Time; uploadedBy : Text }>;
    studentApplicants : Map.Map<Text, { mobile : Text; pinHash : Text; name : Text; createdAt : Time.Time }>;
    applications : Map.Map<Nat16, OldAdmissionApplication>;
    applicantSessions : Map.Map<Principal.Principal, Text>;
    nextApplicationId : Nat;
    siteSettings : OldSiteSettings;
    statSeatsAvailable : Text;
    statStudentsEnrolled : Text;
    statYearsOfService : Text;
    statScholarshipsFacilitated : Text;
  };

  // New types
  type SiteSettings = {
    admissionLink : Text;
    scholarshipLink : Text;
    announcementText : Text;
    seatsAvailable : Text;
    studentsEnrolled : Text;
    yearsOfService : Text;
    scholarshipsFacilitated : Text;
  };

  type AdmissionApplication = {
    // Existing fields
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
    status : { #pending; #approved; #rejected };
    submittedAt : Time.Time;
    reviewedAt : ?Time.Time;
    reviewNote : Text;
    // New fields
    guardianName : ?Text;
    guardianRelationship : ?Text;
    guardianContact : ?Text;
    guardianOccupation : ?Text;
    localGuardianName : ?Text;
    localGuardianMobile : ?Text;
    presentAddress : ?Text;
    bloodGroup : ?Text;
    identificationMark : ?Text;
    healthProblems : ?Text;
    mentionCommunity : ?Text;
    photoIdentityType : ?Text;
    photoIdentityNo : ?Text;
    courseName : ?Text;
    courseDuration : ?Text;
    institutionAddress : ?Text;
    currentYearSemester : ?Text;
    academicRowsJson : ?Text;
    residenceCertUrl : ?Text;
    class10CertUrl : ?Text;
    class12CertUrl : ?Text;
    graduationCertUrl : ?Text;
  };

  type NewActor = {
    // Persistent data structures
    userProfiles : Map.Map<Principal.Principal, { name : Text }>;
    staff : Map.Map<Nat16, { id : Nat16; name : Text; designation : Text; role : Text; phone : Text; email : Text; bio : Text; photoUrl : Text; order : Nat }>;
    students : Map.Map<Nat16, { id : Nat16; name : Text; fatherName : Text; classLevel : Text; rollNumber : Text; year : Text; category : Text; admissionDate : Text }>;
    fees : Map.Map<Nat16, { id : Nat16; category : Text; messFeesPerMonth : Nat; period : Text; notes : Text }>;
    gallery : Map.Map<Nat16, { id : Nat16; title : Text; imageUrl : Text; uploadedAt : Time.Time; uploadedBy : Text }>;
    studentApplicants : Map.Map<Text, { mobile : Text; pinHash : Text; name : Text; createdAt : Time.Time }>;
    applications : Map.Map<Nat16, AdmissionApplication>;
    applicantSessions : Map.Map<Principal.Principal, Text>;
    nextApplicationId : Nat;
    siteSettings : SiteSettings;
  };

  public func run(old : OldActor) : NewActor {
    let newApplications = old.applications.map<Nat16, OldAdmissionApplication, AdmissionApplication>(
      func(_id, oldApp) {
        {
          oldApp with
          // New fields default to null for existing entries
          guardianName = null;
          guardianRelationship = null;
          guardianContact = null;
          guardianOccupation = null;
          localGuardianName = null;
          localGuardianMobile = null;
          presentAddress = null;
          bloodGroup = null;
          identificationMark = null;
          healthProblems = null;
          mentionCommunity = null;
          photoIdentityType = null;
          photoIdentityNo = null;
          courseName = null;
          courseDuration = null;
          institutionAddress = null;
          currentYearSemester = null;
          academicRowsJson = null;
          residenceCertUrl = null;
          class10CertUrl = null;
          class12CertUrl = null;
          graduationCertUrl = null;
        };
      }
    );
    let newSiteSettings : SiteSettings = {
      old.siteSettings with
      seatsAvailable = old.statSeatsAvailable;
      studentsEnrolled = old.statStudentsEnrolled;
      yearsOfService = old.statYearsOfService;
      scholarshipsFacilitated = old.statScholarshipsFacilitated;
    };
    {
      old with
      applications = newApplications;
      siteSettings = newSiteSettings;
    };
  };
};
