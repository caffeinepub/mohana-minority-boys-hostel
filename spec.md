# Mohana Minority Boys Hostel

## Current State
Full-stack hostel management app with:
- Backend: Motoko with authorization (access-control.mo), blob storage, staff, students, fees, gallery, site settings, student applicants, and admission applications
- Frontend: React/TypeScript admin dashboard with tabs for staff, students, fees, gallery, settings, admins, and applications
- Admin login via Internet Identity; first caller with correct admin token becomes admin

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
- Fix the authorization bug: `getUserRole` in access-control currently calls `Runtime.trap("User is not registered")` when a caller has no role assigned. This causes all admin write operations to fail with a trap error instead of returning an "Unauthorized" response. Change this so unregistered users are treated as `#guest` (read-only) instead of trapping.
- The `isAdmin` check must return false (not trap) for unregistered or guest callers, so admin operations gracefully return "Unauthorized" instead of crashing.

### Remove
- Nothing to remove

## Implementation Plan
1. Regenerate backend Motoko with fixed authorization: `getUserRole` returns `#guest` for unregistered users instead of trapping
2. Keep all existing data types, APIs, and business logic identical
3. The only change is the fallback behavior for unregistered callers in getUserRole
