# Simplified CRUD-Based Permission System

## Overview

The permission system has been simplified to follow a standard **CRUD (Create, Read, Update, Delete)** pattern that matches the backend permission structure. This makes it easier to understand and maintain.

## Permission Structure

### Format: `module.operation`

All permissions follow the backend format:
- **`module`** = The feature/module (leads, users, campaigns, etc.)
- **`operation`** = The action (read, create, update, delete)

### Core Permissions

```javascript
// Leads Module
leads.read      → View/Read leads
leads.create    → Create new leads
leads.update    → Update/Edit existing leads
leads.delete    → Delete leads

// Users Module
users.read      → View/Read users
users.create    → Create new users
users.update    → Update/Edit existing users
users.delete    → Delete users

// Campaigns Module
campaigns.read    → View/Read campaigns
campaigns.create  → Create new campaigns
campaigns.update  → Update/Edit existing campaigns
campaigns.delete  → Delete campaigns

// Settings (Admin Only)
settings.view         → Access Settings menu
settings.roles        → Manage Roles & Permissions
settings.products     → Manage Products & Categories
settings.leadStages   → Manage Lead Stages
settings.geography    → Manage Geography data
```

## Role Permissions Matrix

| Role | Leads | Users | Campaigns | Settings |
|------|-------|-------|-----------|----------|
| **Super Admin** | Full CRUD | Full CRUD | Full CRUD | Full Access |
| **Admin** | Full CRUD | Full CRUD | Full CRUD | Full Access |
| **Manager** | Read, Create, Update | Read only | Read only | No Access |
| **Sales Rep** | Read, Create, Update | No Access | Read only | No Access |
| **Viewer** | Read only | No Access | Read only | No Access |

## Detailed Role Breakdown

### Super Admin
**Full access to everything**
```javascript
PERMISSIONS: All permissions in the system
```

### Admin
**Full CRUD + Settings access**
```javascript
PERMISSIONS: [
  'dashboard.view',
  
  // Leads
  'leads.read',
  'leads.create',
  'leads.update',
  'leads.delete',
  
  // Users
  'users.read',
  'users.create',
  'users.update',
  'users.delete',
  
  // Campaigns
  'campaigns.read',
  'campaigns.create',
  'campaigns.update',
  'campaigns.delete',
  
  // Settings - Admin only
  'settings.view',
  'settings.roles',
  'settings.products',
  'settings.leadStages',
  'settings.geography',
]
```

**Admin users can:**
- ✅ View all modules
- ✅ Create, edit, delete in all modules
- ✅ Access Settings menu
- ✅ Manage roles, products, lead stages, geography
- ✅ Manage all users

### Manager
**Lead management + Read access to others**
```javascript
PERMISSIONS: [
  'dashboard.view',
  
  // Leads - Full management
  'leads.read',
  'leads.create',
  'leads.update',
  
  // Users - Read only
  'users.read',
  
  // Campaigns - Read only
  'campaigns.read',
]
```

**Manager users can:**
- ✅ View dashboard
- ✅ Create and manage leads
- ✅ View users list
- ✅ View campaigns
- ❌ Cannot delete leads
- ❌ Cannot manage users
- ❌ Cannot manage campaigns
- ❌ Cannot access Settings

### Sales Representative
**Lead management + View campaigns**
```javascript
PERMISSIONS: [
  'dashboard.view',
  
  // Leads - Create and manage
  'leads.read',
  'leads.create',
  'leads.update',
  
  // Campaigns - Read only
  'campaigns.read',
]
```

**Sales Rep users can:**
- ✅ View dashboard
- ✅ Create and edit leads
- ✅ View campaigns
- ❌ Cannot delete leads
- ❌ Cannot view users
- ❌ Cannot access Settings

### Viewer
**Read-only access**
```javascript
PERMISSIONS: [
  'dashboard.view',
  'leads.read',
  'campaigns.read',
]
```

**Viewer users can:**
- ✅ View dashboard
- ✅ View leads
- ✅ View campaigns
- ❌ Cannot create anything
- ❌ Cannot edit anything
- ❌ Cannot delete anything
- ❌ Cannot access Settings

## Settings Access

**Important:** Only users with `settings.view` permission can see the Settings menu.

Currently, **only Admin and Super Admin** roles have Settings access.

### Settings Tabs Permissions

| Tab | Permission | Who Has Access |
|-----|------------|----------------|
| Profile | `null` (everyone) | All users |
| Geography | `settings.geography` | Admin, Super Admin |
| Lead Stages | `settings.leadStages` | Admin, Super Admin |
| Products & Categories | `settings.products` | Admin, Super Admin |
| Roles & Permissions | `settings.roles` | Admin, Super Admin |

## UI Permission Enforcement

### Navigation Menu (Sidebar/Bottom Nav)
- **Automatically filtered** based on user permissions
- Menu items require specific permissions:
  - Dashboard → `dashboard.view`
  - Users → `users.read`
  - Leads → `leads.read`
  - Campaigns → `campaigns.read`
  - Settings → `settings.view` (Admin only)

### Action Buttons
Action buttons use `CanAccess` component:

```javascript
// View button
<CanAccess permission={PERMISSIONS.LEADS_READ}>
  <button>View</button>
</CanAccess>

// Edit button
<CanAccess permission={PERMISSIONS.LEADS_UPDATE}>
  <button>Edit</button>
</CanAccess>

// Delete button
<CanAccess permission={PERMISSIONS.LEADS_DELETE}>
  <button>Delete</button>
</CanAccess>
```

### Route Protection
Routes use `PermissionGuard`:

```javascript
// View leads list
<Route path="leads" element={
  <PermissionGuard permission={PERMISSIONS.LEADS_READ}>
    <Leads />
  </PermissionGuard>
} />

// Create lead
<Route path="leads/new" element={
  <PermissionGuard permission={PERMISSIONS.LEADS_CREATE}>
    <LeadEditPage />
  </PermissionGuard>
} />

// Edit lead
<Route path="leads/:id/edit" element={
  <PermissionGuard permission={PERMISSIONS.LEADS_UPDATE}>
    <LeadEditPage />
  </PermissionGuard>
} />
```

## Backward Compatibility

The system maintains backward compatibility with old permission names:

```javascript
// Old names (still work)
PERMISSIONS.LEADS_VIEW   → maps to → leads.read
PERMISSIONS.LEADS_EDIT   → maps to → leads.update
PERMISSIONS.USERS_VIEW   → maps to → users.read
PERMISSIONS.USERS_EDIT   → maps to → users.update
PERMISSIONS.CAMPAIGNS_VIEW → maps to → campaigns.read
PERMISSIONS.CAMPAIGNS_EDIT → maps to → campaigns.update

// New names (preferred)
PERMISSIONS.LEADS_READ
PERMISSIONS.LEADS_UPDATE
PERMISSIONS.USERS_READ
PERMISSIONS.USERS_UPDATE
PERMISSIONS.CAMPAIGNS_READ
PERMISSIONS.CAMPAIGNS_UPDATE
```

## How Backend Permissions Work

The backend returns user data with role and permissions:

```javascript
{
  user: {
    id: "123",
    name: "John Doe",
    email: "john@example.com",
    role: {
      name: "Admin",
      permission: [
        { key: "leads.read", name: "Read Leads" },
        { key: "leads.create", name: "Create Leads" },
        { key: "leads.update", name: "Update Leads" },
        { key: "leads.delete", name: "Delete Leads" },
        // ... more permissions
      ]
    }
  }
}
```

The `hasPermission()` function checks if the user's role includes the required permission.

## Testing Different Roles

### Test Case 1: Admin User
**Expected behavior:**
- ✅ See all menu items (Dashboard, Users, Leads, Campaigns, Settings)
- ✅ See all Settings tabs
- ✅ See all action buttons (View, Edit, Delete)
- ✅ Can perform all CRUD operations

### Test Case 2: Manager User
**Expected behavior:**
- ✅ See: Dashboard, Users, Leads, Campaigns
- ❌ Don't see: Settings menu
- ✅ In Leads: See View, Edit buttons
- ❌ In Leads: Don't see Delete button
- ✅ Can create and edit leads
- ❌ Cannot delete leads

### Test Case 3: Sales Rep User
**Expected behavior:**
- ✅ See: Dashboard, Leads, Campaigns
- ❌ Don't see: Users, Settings
- ✅ In Leads: See View, Edit buttons
- ❌ In Leads: Don't see Delete button
- ✅ Can create and edit leads
- ❌ Cannot view users list

### Test Case 4: Viewer User
**Expected behavior:**
- ✅ See: Dashboard, Leads, Campaigns
- ❌ Don't see: Users, Settings
- ✅ In Leads: See View button only
- ❌ In Leads: Don't see Edit, Delete buttons
- ❌ Don't see "Add Lead" button
- ✅ Can only view data (read-only)

## Permission Check Examples

### Check Single Permission
```javascript
import { hasPermission, PERMISSIONS } from '../utils/permissions';

const canEditLeads = hasPermission(currentUser, PERMISSIONS.LEADS_UPDATE);
if (canEditLeads) {
  // Show edit button
}
```

### Check Multiple Permissions (OR)
```javascript
import { hasAnyPermission, PERMISSIONS } from '../utils/permissions';

const canAccessLeads = hasAnyPermission(currentUser, [
  PERMISSIONS.LEADS_READ,
  PERMISSIONS.LEADS_CREATE,
  PERMISSIONS.LEADS_UPDATE,
]);
```

### Check Multiple Permissions (AND)
```javascript
import { hasAllPermissions, PERMISSIONS } from '../utils/permissions';

const canFullyManageLeads = hasAllPermissions(currentUser, [
  PERMISSIONS.LEADS_READ,
  PERMISSIONS.LEADS_CREATE,
  PERMISSIONS.LEADS_UPDATE,
  PERMISSIONS.LEADS_DELETE,
]);
```

## Best Practices

### ✅ DO

1. **Use CRUD pattern** - Stick to read, create, update, delete
2. **Check at multiple levels** - Route + UI + API
3. **Use semantic naming** - `leads.read` is clearer than `leads.view`
4. **Follow the matrix** - Use the role permissions matrix as reference
5. **Test with real users** - Verify permissions work correctly

### ❌ DON'T

1. **Don't skip route protection** - Always use `PermissionGuard`
2. **Don't hardcode permissions** - Use `PERMISSIONS` constants
3. **Don't mix naming** - Prefer new names over old aliases
4. **Don't bypass checks** - Never show UI without permission
5. **Don't forget Settings** - Settings is Admin-only

## Summary

### Simplified Structure
```
Module.Operation
   ↓        ↓
 leads   .read
 leads   .create
 leads   .update
 leads   .delete
```

### Three Permission Levels
1. **Route Level** - `PermissionGuard` (blocks page access)
2. **UI Level** - `CanAccess` (hides/shows elements)
3. **API Level** - Backend validates (security layer)

### Admin-Only Features
- Settings menu and all its tabs
- User management (full CRUD)
- System configuration

### Key Changes from Previous System
- ✅ Simplified from complex granular permissions to CRUD
- ✅ Matches backend permission structure
- ✅ Easier to understand and maintain
- ✅ Settings is now Admin-only
- ✅ Backward compatible with old code

This simplified system provides clear, consistent permission management across the entire application.

