import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Nat16 "mo:core/Nat16";
import Principal "mo:core/Principal";
import Nat32 "mo:core/Nat32";
import List "mo:core/List";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Nat8 "mo:core/Nat8";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Mixins for blob storage and authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // ---------- Types ----------
  public type UserProfile = {
    name : Text;
  };

  public type StaffMember = {
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

  module StaffMember {
    public func compareByOrder(a : StaffMember, b : StaffMember) : Order.Order {
      Nat.compare(a.order, b.order);
    };
  };

  public type Student = {
    id : Nat16;
    name : Text;
    fatherName : Text;
    classLevel : Text;
    rollNumber : Text;
    year : Text;
    category : Text;
    admissionDate : Text;
  };

  public type FeesStructure = {
    id : Nat16;
    category : Text;
    messFeesPerMonth : Nat;
    period : Text;
    notes : Text;
  };

  public type GalleryImage = {
    id : Nat16;
    title : Text;
    imageUrl : Text;
    uploadedAt : Time.Time;
    uploadedBy : Text;
  };

  public type SiteSettings = {
    admissionLink : Text;
    scholarshipLink : Text;
    announcementText : Text;
  };

  public type StudentApplicant = {
    mobile : Text;
    pinHash : Text;
    name : Text;
    createdAt : Time.Time;
  };

  public type ApplicationStatus = {
    #pending;
    #approved;
    #rejected;
  };

  public type AdmissionApplication = {
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
    submittedAt : Time.Time;
    reviewedAt : ?Time.Time;
    reviewNote : Text;
  };

  // Persistent data structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  let staff = Map.empty<Nat16, StaffMember>();
  let students = Map.empty<Nat16, Student>();
  let fees = Map.empty<Nat16, FeesStructure>();
  let gallery = Map.empty<Nat16, GalleryImage>();
  let studentApplicants = Map.empty<Text, StudentApplicant>();
  let applications = Map.empty<Nat16, AdmissionApplication>();
  let applicantSessions = Map.empty<Principal, Text>();
  var nextApplicationId : Nat = 1;

  var siteSettings : SiteSettings = {
    admissionLink = "";
    scholarshipLink = "https://scholarship.odisha.gov.in/";
    announcementText = "Welcome to Post Matric Minority Boys Hostel, Biribatia, Mohana";
  };

  // ---------- User Profile Management ----------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Unauthorized: Anonymous users cannot save profiles. Please log in with your Internet Identity to continue."
      );
    };
    userProfiles.add(caller, profile);
  };

  // ---------- Staff Management ----------
  public shared ({ caller }) func addOrUpdateStaff(staffMember : StaffMember) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage staff. Please log in with your Internet Identity to continue."
      );
    };
    staff.add(staffMember.id, staffMember);
  };

  public shared ({ caller }) func removeStaff(id : Nat16) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage staff. Please log in with your Internet Identity to continue."
      );
    };
    staff.remove(id);
  };

  public query func getStaffMember(id : Nat16) : async StaffMember {
    switch (staff.get(id)) {
      case (null) { Runtime.trap("Staff member not found") };
      case (?member) { member };
    };
  };

  public query func getAllStaff() : async [StaffMember] {
    staff.values().toArray().sort(StaffMember.compareByOrder);
  };

  // ---------- Student Management ----------
  public shared ({ caller }) func addOrUpdateStudent(student : Student) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage students. Please log in with your Internet Identity to continue."
      );
    };
    students.add(student.id, student);
  };

  public shared ({ caller }) func removeStudent(id : Nat16) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage students. Please log in with your Internet Identity to continue."
      );
    };
    students.remove(id);
  };

  public query func getStudent(id : Nat16) : async Student {
    switch (students.get(id)) {
      case (null) { Runtime.trap("Student not found") };
      case (?student) { student };
    };
  };

  public query func getAllStudents() : async [Student] {
    students.values().toArray();
  };

  public shared ({ caller }) func bulkAddStudents(newStudents : [Student]) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot bulk add students. Please log in with your Internet Identity to continue."
      );
    };
    for (s in newStudents.values()) {
      students.add(s.id, s);
    };
  };

  // ---------- Fees Management ----------
  public shared ({ caller }) func addOrUpdateFees(feesStructure : FeesStructure) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage fees. Please log in with your Internet Identity to continue."
      );
    };
    fees.add(feesStructure.id, feesStructure);
  };

  public shared ({ caller }) func removeFees(id : Nat16) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage fees. Please log in with your Internet Identity to continue."
      );
    };
    fees.remove(id);
  };

  public query func getFees(id : Nat16) : async FeesStructure {
    switch (fees.get(id)) {
      case (null) { Runtime.trap("Fees entry not found") };
      case (?feesStructure) { feesStructure };
    };
  };

  public query func getAllFees() : async [FeesStructure] {
    fees.values().toArray();
  };

  // ---------- Gallery Management ----------
  public shared ({ caller }) func addOrUpdateGalleryImage(image : GalleryImage) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage gallery images. Please log in with your Internet Identity to continue."
      );
    };
    gallery.add(image.id, image);
  };

  public shared ({ caller }) func removeGalleryImage(id : Nat16) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot manage gallery images. Please log in with your Internet Identity to continue."
      );
    };
    gallery.remove(id);
  };

  public query func getGalleryImage(id : Nat16) : async GalleryImage {
    switch (gallery.get(id)) {
      case (null) { Runtime.trap("Gallery image not found") };
      case (?image) { image };
    };
  };

  public query func getAllGalleryImages() : async [GalleryImage] {
    gallery.values().toArray();
  };

  // ---------- Site Settings Management ----------
  public shared ({ caller }) func updateSiteSettings(newSettings : SiteSettings) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot update site settings. Please log in with your Internet Identity to continue."
      );
    };
    siteSettings := newSettings;
  };

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };

  // ---------- Student Applicants Auth (No authentication required) ----------
  func hashPin(pin : Text) : Text {
    let chars = List.fromIter(pin.chars());
    chars.toText();
  };

  public shared ({ caller }) func registerApplicant(mobile : Text, pin : Text, name : Text) : async () {
    let existing = studentApplicants.get(mobile);
    switch (existing) {
      case (null) {
        let newApplicant : StudentApplicant = {
          mobile;
          pinHash = hashPin(pin);
          name;
          createdAt = Time.now();
        };
        studentApplicants.add(mobile, newApplicant);
      };
      case (?_) { Runtime.trap("Mobile number already registered") };
    };
  };

  public shared ({ caller }) func loginApplicant(mobile : Text, pin : Text) : async () {
    switch (studentApplicants.get(mobile)) {
      case (null) { Runtime.trap("Mobile number not registered") };
      case (?applicant) {
        if (applicant.pinHash != hashPin(pin)) {
          Runtime.trap("Invalid PIN");
        };
        // Create session by linking caller Principal to mobile number
        applicantSessions.add(caller, mobile);
      };
    };
  };

  // ---------- Admission Application APIs ----------
  public shared ({ caller }) func submitApplication(applicationRequest : AdmissionApplication) : async Nat16 {
    // No authorization check - accessible to all including guests
    let newId = if (nextApplicationId > 65535) { 1 } else { nextApplicationId };
    nextApplicationId += 1;

    let application : AdmissionApplication = {
      applicationRequest with
      id = Nat16.fromNat(newId);
      status = #pending;
      submittedAt = Time.now();
      reviewedAt = null;
    };

    applications.add(Nat16.fromNat(newId), application);

    Nat16.fromNat(newId);
  };

  public query ({ caller }) func getMyApplication(mobile : Text) : async AdmissionApplication {
    let sessionMobile = applicantSessions.get(caller);
    let authorized = switch (sessionMobile) {
      case (null) { false };
      case (?m) { m == mobile };
    };
    if (not authorized) {
      Runtime.trap("Unauthorized: Access denied. Session does not match requested mobile number. Please ensure you are logged in with the correct credentials and try again.");
    };
    let appIter = applications.values();
    switch (appIter.find(func(app) { app.applicantMobile == mobile })) {
      case (null) {
        Runtime.trap("Application not found for mobile: " # mobile);
      };
      case (?app) { app };
    };
  };

  public query ({ caller }) func getAllApplications() : async [AdmissionApplication] {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot view admission applications. Please log in with your Internet Identity to continue."
      );
    };
    applications.values().toArray();
  };

  public shared ({ caller }) func approveApplication(id : Nat16, note : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot approve applications. Please log in with your Internet Identity to continue."
      );
    };
    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        let updatedApp = {
          app with
          status = #approved;
          reviewedAt = ?Time.now();
          reviewNote = note;
        };
        applications.add(id, updatedApp);
      };
    };
  };

  public shared ({ caller }) func rejectApplication(id : Nat16, note : Text) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap(
        "Anonymous users cannot reject applications. Please log in with your Internet Identity to continue."
      );
    };
    switch (applications.get(id)) {
      case (null) { Runtime.trap("Application not found") };
      case (?app) {
        let updatedApp = {
          app with
          status = #rejected;
          reviewedAt = ?Time.now();
          reviewNote = note;
        };
        applications.add(id, updatedApp);
      };
    };
  };
};
