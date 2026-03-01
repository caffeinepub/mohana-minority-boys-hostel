import Text "mo:core/Text";
import Time "mo:core/Time";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Mixins for blob storage and authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

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

  // Persistent data structures
  let userProfiles = Map.empty<Principal, UserProfile>();
  let staff = Map.empty<Nat16, StaffMember>();
  let students = Map.empty<Nat16, Student>();
  let fees = Map.empty<Nat16, FeesStructure>();
  let gallery = Map.empty<Nat16, GalleryImage>();
  var siteSettings : SiteSettings = {
    admissionLink = "";
    scholarshipLink = "https://scholarship.odisha.gov.in/";
    announcementText = "Welcome to Post Matric Minority Boys Hostel, Biribatia, Mohana";
  };

  // --- User Profile Management ---
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // --- Staff Management ---
  public shared ({ caller }) func addOrUpdateStaff(staffMember : StaffMember) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
    };
    staff.add(staffMember.id, staffMember);
  };

  public shared ({ caller }) func removeStaff(id : Nat16) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
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

  // --- Student Management ---
  public shared ({ caller }) func addOrUpdateStudent(student : Student) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
    };
    students.add(student.id, student);
  };

  public shared ({ caller }) func removeStudent(id : Nat16) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
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

  // --- Fees Management ---
  public shared ({ caller }) func addOrUpdateFees(feesStructure : FeesStructure) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
    };
    fees.add(feesStructure.id, feesStructure);
  };

  public shared ({ caller }) func removeFees(id : Nat16) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
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

  // --- Gallery Management ---
  public shared ({ caller }) func addOrUpdateGalleryImage(image : GalleryImage) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
    };
    gallery.add(image.id, image);
  };

  public shared ({ caller }) func removeGalleryImage(id : Nat16) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
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

  // --- Site Settings Management ---
  public shared ({ caller }) func updateSiteSettings(newSettings : SiteSettings) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can perform this operation");
    };
    siteSettings := newSettings;
  };

  public query func getSiteSettings() : async SiteSettings {
    siteSettings;
  };
};
