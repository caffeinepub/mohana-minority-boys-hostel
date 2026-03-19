# Mohana Minority Boys Hostel

## Current State
- Admin dashboard has a "Delete All Students" button with confirmation dialog, but it is not working.
- The admission form saves all form data (guardian, health, academic rows) to localStorage on submit, then the PDF reads from localStorage. If localStorage is cleared or user is on a different device, the PDF shows blanks for those fields.
- The `AdmissionApplication` backend type is missing many fields: guardian details, health info, academic rows, extra document URLs (residenceCertUrl, class10CertUrl, class12CertUrl, graduationCertUrl), local guardian info, blood group, etc.

## Requested Changes (Diff)

### Add
- Extended `AdmissionApplication` backend type with all form fields: guardianName, guardianRelationship, guardianContact, guardianOccupation, localGuardianName, localGuardianMobile, presentAddress, bloodGroup, identificationMark, healthProblems, courseName, courseDuration, institutionAddress, academicRowsJson (serialized JSON string of academic rows), residenceCertUrl, class10CertUrl, class12CertUrl, graduationCertUrl, mentionCommunity, photoIdentityType, photoIdentityNo, currentYearSemester

### Modify
- `deleteAllStudents` backend: change implementation to iterate over all student IDs and remove them one by one instead of relying on `Map.clear()`
- `AdmissionApplication` type: add all missing fields
- Frontend ApplicationFormPage: pass all fields to the backend when submitting
- Frontend ApplicationStatusPage PDF: read all data from the `application` object from backend instead of relying on localStorage

### Remove
- Dependency on localStorage for PDF data (localStorage can still be used as a cache but backend is the source of truth)

## Implementation Plan
1. Regenerate backend with extended AdmissionApplication type and fixed deleteAllStudents
2. Update ApplicationFormPage to include all form fields in the submitted application object
3. Update ApplicationStatusPage to build PDF from backend application data (no localStorage dependency)
4. Validate and deploy
