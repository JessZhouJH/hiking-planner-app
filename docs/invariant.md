StatusRBAC - Applied in UserRole and RolePermission

ACTIVE:
- revoked_at IS NULL
- revoked_by_id IS NULL

ARCHIVED:
- revoked_at IS NOT NULL
- revoked_by_id IS NOT NULL

If archived:
- revoked_at >= granted_at

Archived RBAC records are immutable.
Re-granting creates a new record.
