# Mohana Minority Boys Hostel

## Current State
Full-stack hostel management website with:
- Public pages: Home, Staff, Students, Fees, Scholarship, Gallery, Admission
- Admin dashboard with tabs: Applications, Staff, Students, Fees, Gallery, Settings, Admins
- Internet Identity login for admin access (open to all authenticated users)
- Student applicant portal with mobile+PIN registration, 3-step application form
- Blob storage for photo/document uploads
- Authorization module (access-control.mo) where first caller with admin token becomes admin, others become #user

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- **Authorization logic**: The `isCallerAdminSafe` and `hasUserPermission` helper functions must allow ANY non-anonymous caller (not just those with `#admin` role). Since the admin panel was opened to all logged-in users, write operations must also permit any authenticated principal. Previously, users were assigned `#user` role on first login (not `#admin`) and this blocked all save/update operations.

### Remove
- Nothing

## Implementation Plan
1. Regenerate backend with corrected authorization helpers:
   - `isCallerAdminSafe(caller)`: returns `true` for any non-anonymous principal
   - `hasUserPermission(caller)`: returns `true` for any non-anonymous principal
   - All other backend logic (staff, students, fees, gallery, applications, settings, applicant auth) remains identical
2. Keep all existing data types, APIs, and functionality unchanged
