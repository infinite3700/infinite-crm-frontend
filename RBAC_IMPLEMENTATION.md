# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This document describes the comprehensive Role-Based Access Control (RBAC) system implemented in the Infinite CRM application. The system provides fine-grained control over user access to features, pages, and actions based on their assigned roles and permissions.

## Architecture

### Core Components

1. **Permission System** (`src/utils/permissions.js`)

   - Centralized permission definitions
   - Role-to-permission mappings
   - Permission checking utilities

2. **Guard Components**

   - `PermissionGuard` - Protects routes/components based on permissions
   - `RoleGuard` - Protects routes/components based on roles
   - `CanAccess` - Conditional rendering based on permissions

3. **Route Protection** (`src/routes/AppRouter.jsx`)

   - Permission-based route guards
   - Unauthorized page redirect

4. **Hooks**
   - `usePermission` - Check permissions in components
   - `useRole` - Check roles in components

## Permission Structure

### Permission Constants

Located in `src/utils/permissions.js`:

```javascript
export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard.view',

  // Leads
  LEADS_VIEW: 'leads.view',
  LEADS_CREATE: 'leads.create',
  LEADS_EDIT: 'leads.edit',
  LEADS_DELETE: 'leads.delete',
  LEADS_ASSIGN: 'leads.assign',
  LEADS_CONVERT: 'leads.convert',
  LEADS_EXPORT: 'leads.export',

  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Campaigns
  CAMPAIGNS_VIEW: 'campaigns.view',
  CAMPAIGNS_CREATE: 'campaigns.create',
  CAMPAIGNS_EDIT: 'campaigns.edit',
  CAMPAIGNS_DELETE: 'campaigns.delete',

  // Settings
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_ROLES: 'settings.roles',
  SETTINGS_PRODUCTS: 'settings.products',
  SETTINGS_LEAD_STAGES: 'settings.leadStages',
  SETTINGS_GEOGRAPHY: 'settings.geography',
  SETTINGS_CAMPAIGNS: 'settings.campaigns',

  // Tasks
  TASKS_VIEW: 'tasks.view',
  TASKS_CREATE: 'tasks.create',
  TASKS_EDIT: 'tasks.edit',
  TASKS_DELETE: 'tasks.delete',

  // Reports
  REPORTS_VIEW: 'reports.view',
  REPORTS_EXPORT: 'reports.export',
};
```

### Default Roles

```javascript
export const ROLES = {
  SUPER_ADMIN: 'Super Admin', // Full access
  ADMIN: 'Admin', // Most administrative functions
  MANAGER: 'Manager', // Team management
  SALES_REP: 'Sales Representative', // Basic CRM functions
  VIEWER: 'Viewer', // Read-only access
};
```

## Usage Examples

### 1. Protecting Routes

In `src/routes/AppRouter.jsx`:

```jsx
import PermissionGuard from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/permissions';

<Route
  path="leads"
  element={
    <PermissionGuard permission={PERMISSIONS.LEADS_VIEW} redirectTo="/unauthorized">
      <Leads />
    </PermissionGuard>
  }
/>;
```

### 2. Conditional Rendering in Components

```jsx
import CanAccess from '../components/CanAccess';
import { PERMISSIONS } from '../utils/permissions';

function LeadsPage() {
  return (
    <div>
      <h1>Leads</h1>

      {/* Show button only if user has create permission */}
      <CanAccess permission={PERMISSIONS.LEADS_CREATE}>
        <Button onClick={createLead}>Add Lead</Button>
      </CanAccess>

      {/* Show edit button only if user has edit permission */}
      <CanAccess permission={PERMISSIONS.LEADS_EDIT}>
        <Button onClick={editLead}>Edit</Button>
      </CanAccess>

      {/* Show delete button only if user has delete permission */}
      <CanAccess permission={PERMISSIONS.LEADS_DELETE}>
        <Button onClick={deleteLead}>Delete</Button>
      </CanAccess>
    </div>
  );
}
```

### 3. Using Permission Hooks

```jsx
import { usePermission } from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();

  // Check single permission
  if (hasPermission(PERMISSIONS.LEADS_CREATE)) {
    // Show create button
  }

  // Check if user has any of the permissions
  if (hasAnyPermission([PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_DELETE])) {
    // Show actions menu
  }

  // Check if user has all permissions
  if (hasAllPermissions([PERMISSIONS.LEADS_VIEW, PERMISSIONS.LEADS_EDIT])) {
    // Enable advanced features
  }

  return <div>...</div>;
}
```

### 4. Protecting Based on Roles

```jsx
import RoleGuard from '../components/RoleGuard';
import { ROLES } from '../utils/permissions';

// Show component only to admins
<RoleGuard role={ROLES.ADMIN}>
  <AdminPanel />
</RoleGuard>

// Show component to multiple roles
<RoleGuard roles={[ROLES.ADMIN, ROLES.MANAGER]}>
  <ManagementTools />
</RoleGuard>
```

### 5. Higher-Order Components

```jsx
import { withPermission } from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/permissions';

const LeadsPage = () => {
  return <div>Leads Management</div>;
};

// Wrap component with permission check
export default withPermission(LeadsPage, {
  permission: PERMISSIONS.LEADS_VIEW,
  redirectTo: '/unauthorized',
});
```

## Backend Integration

### User Object Structure

The backend should return user objects with the following structure:

```javascript
{
  _id: "user123",
  username: "john.doe",
  email: "john@example.com",
  name: "John Doe",
  role: {
    _id: "role123",
    name: "Admin",
    permission: [
      { _id: "perm1", key: "leads.view", description: "View leads" },
      { _id: "perm2", key: "leads.create", description: "Create leads" },
      { _id: "perm3", key: "leads.edit", description: "Edit leads" }
    ]
  }
}
```

### API Endpoints

Required endpoints for roles and permissions management:

```
GET    /settings/roles           - Get all roles
GET    /settings/roles/:id       - Get role by ID
POST   /settings/roles           - Create new role
PUT    /settings/roles/:id       - Update role
DELETE /settings/roles/:id       - Delete role

GET    /settings/permissions     - Get all permissions
GET    /settings/permissions/:id - Get permission by ID
POST   /settings/permissions     - Create new permission
PUT    /settings/permissions/:id - Update permission
DELETE /settings/permissions/:id - Delete permission
```

## Permission Naming Convention

Use dot notation for permission keys:

```
<module>.<action>

Examples:
- leads.view
- leads.create
- leads.edit
- leads.delete
- users.view
- settings.roles
```

## Best Practices

### 1. Always Check Permissions at Multiple Levels

```jsx
// Route level protection
<Route path="leads" element={<PermissionGuard permission={PERMISSIONS.LEADS_VIEW}><Leads /></PermissionGuard>} />

// Component level protection
<CanAccess permission={PERMISSIONS.LEADS_CREATE}>
  <Button>Add Lead</Button>
</CanAccess>

// Backend API should also verify permissions
```

### 2. Use Granular Permissions

Instead of:

```javascript
LEADS: 'leads'; // Too broad
```

Use:

```javascript
LEADS_VIEW: 'leads.view',
LEADS_CREATE: 'leads.create',
LEADS_EDIT: 'leads.edit',
LEADS_DELETE: 'leads.delete',
```

### 3. Provide Fallback UI

```jsx
<CanAccess
  permission={PERMISSIONS.LEADS_EDIT}
  fallback={<p>You don't have permission to edit leads</p>}
>
  <EditForm />
</CanAccess>
```

### 4. Combine Multiple Permissions

```jsx
// Require ANY of these permissions
<CanAccess
  permissions={[PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_DELETE]}
  requireAll={false}
>
  <ActionsMenu />
</CanAccess>

// Require ALL of these permissions
<CanAccess
  permissions={[PERMISSIONS.LEADS_VIEW, PERMISSIONS.LEADS_EXPORT]}
  requireAll={true}
>
  <ExportButton />
</CanAccess>
```

## Testing Permissions

### Manual Testing

1. Create test users with different roles
2. Log in as each user
3. Verify access to features matches role permissions
4. Check unauthorized redirects work correctly

### Example Test Scenarios

| Role        | Can View Leads | Can Create Leads | Can Edit Leads | Can Delete Leads | Can Manage Users |
| ----------- | -------------- | ---------------- | -------------- | ---------------- | ---------------- |
| Super Admin | ✅             | ✅               | ✅             | ✅               | ✅               |
| Admin       | ✅             | ✅               | ✅             | ✅               | ✅               |
| Manager     | ✅             | ✅               | ✅             | ❌               | ❌               |
| Sales Rep   | ✅             | ✅               | ✅             | ❌               | ❌               |
| Viewer      | ✅             | ❌               | ❌             | ❌               | ❌               |

## Troubleshooting

### Permission Not Working

1. **Check user object in Redux store:**

   ```javascript
   import { useSelector } from 'react-redux';
   import { selectCurrentUser } from '../store/authSlice';

   const user = useSelector(selectCurrentUser);
   console.log('Current user:', user);
   console.log('User role:', user.role);
   console.log('User permissions:', user.role.permission);
   ```

2. **Verify permission key matches:**

   - Check `PERMISSIONS` constant
   - Check backend permission `key` field
   - Ensure exact match (case-sensitive)

3. **Check role name:**
   - Verify role name in `ROLES` constant
   - Check backend role `name` field
   - Ensure exact match

### Unauthorized Redirects Not Working

1. Ensure `Unauthorized` component route is defined
2. Check `redirectTo` prop in `PermissionGuard`
3. Verify navigation is not blocked elsewhere

## Security Considerations

1. **Never rely solely on frontend checks**

   - Always validate permissions on the backend
   - Frontend guards are for UX, not security

2. **Keep permissions up to date**

   - Sync permission changes between frontend and backend
   - Update default role permissions when adding new features

3. **Implement permission caching**

   - Cache user permissions in Redux
   - Refresh on login/logout
   - Consider TTL for permission data

4. **Audit permission changes**
   - Log when permissions are granted/revoked
   - Track who made the changes
   - Review permission assignments regularly

## Future Enhancements

1. **Dynamic Permission Loading**

   - Load permissions from backend instead of hardcoding
   - Allow runtime permission updates

2. **Permission Groups**

   - Group related permissions
   - Bulk assign permission groups to roles

3. **Context-Based Permissions**

   - Owner-based permissions (edit only own leads)
   - Team-based permissions (manage team members' leads)

4. **Permission Inheritance**

   - Role hierarchy with inheritance
   - Sub-roles inheriting from parent roles

5. **Time-Based Permissions**
   - Temporary permission grants
   - Scheduled permission changes

## Support

For questions or issues with the RBAC system:

1. Check this documentation
2. Review existing implementations in the codebase
3. Contact the development team

---

**Last Updated:** November 2024
**Version:** 1.0.0
