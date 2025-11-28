# RBAC Quick Reference Guide

## Quick Start

### 1. Import What You Need

```javascript
// Permissions
import { PERMISSIONS, ROLES } from '../utils/permissions';

// Components
import CanAccess from '../components/CanAccess';
import PermissionGuard from '../components/PermissionGuard';
import RoleGuard from '../components/RoleGuard';

// Hooks
import { usePermission } from '../components/PermissionGuard';
import { useRole } from '../components/RoleGuard';
```

### 2. Common Use Cases

#### Hide/Show Buttons Based on Permission

```jsx
import CanAccess from '../components/CanAccess';
import { PERMISSIONS } from '../utils/permissions';

<CanAccess permission={PERMISSIONS.LEADS_CREATE}>
  <Button onClick={handleCreate}>Add Lead</Button>
</CanAccess>;
```

#### Protect a Route

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

#### Check Permission in Component Logic

```jsx
import { usePermission } from '../components/PermissionGuard';
import { PERMISSIONS } from '../utils/permissions';

function MyComponent() {
  const { hasPermission } = usePermission();

  const canEdit = hasPermission(PERMISSIONS.LEADS_EDIT);

  const handleClick = () => {
    if (canEdit) {
      // Do something
    }
  };
}
```

## Available Permissions

### Dashboard

- `DASHBOARD_VIEW` - View dashboard

### Leads

- `LEADS_VIEW` - View leads
- `LEADS_CREATE` - Create new leads
- `LEADS_EDIT` - Edit existing leads
- `LEADS_DELETE` - Delete leads
- `LEADS_ASSIGN` - Assign leads to users
- `LEADS_CONVERT` - Convert leads
- `LEADS_EXPORT` - Export leads data

### Users

- `USERS_VIEW` - View users
- `USERS_CREATE` - Create new users
- `USERS_EDIT` - Edit users
- `USERS_DELETE` - Delete users

### Campaigns

- `CAMPAIGNS_VIEW` - View campaigns
- `CAMPAIGNS_CREATE` - Create campaigns
- `CAMPAIGNS_EDIT` - Edit campaigns
- `CAMPAIGNS_DELETE` - Delete campaigns

### Settings

- `SETTINGS_VIEW` - View settings
- `SETTINGS_ROLES` - Manage roles & permissions
- `SETTINGS_PRODUCTS` - Manage products
- `SETTINGS_LEAD_STAGES` - Manage lead stages
- `SETTINGS_GEOGRAPHY` - Manage geography data
- `SETTINGS_CAMPAIGNS` - Manage campaign settings

### Tasks

- `TASKS_VIEW` - View tasks
- `TASKS_CREATE` - Create tasks
- `TASKS_EDIT` - Edit tasks
- `TASKS_DELETE` - Delete tasks

### Reports

- `REPORTS_VIEW` - View reports
- `REPORTS_EXPORT` - Export reports

## Component API Reference

### CanAccess

Conditional rendering based on permissions.

```jsx
<CanAccess
  permission="leads.view" // Single permission
  permissions={['a', 'b']} // Multiple permissions
  requireAll={false} // Require all permissions (default: false)
  fallback={<NoAccess />} // Component to show if no access
>
  <ProtectedContent />
</CanAccess>
```

### PermissionGuard

Route/component protection based on permissions.

```jsx
<PermissionGuard
  permission="leads.view" // Single permission
  permissions={['a', 'b']} // Multiple permissions
  requireAll={false} // Require all permissions
  requireAny={false} // Require any permission
  redirectTo="/unauthorized" // Redirect path if no access
  fallback={<NoAccess />} // Component to show if no access
>
  <ProtectedRoute />
</PermissionGuard>
```

### RoleGuard

Route/component protection based on roles.

```jsx
<RoleGuard
  role="Admin" // Single role
  roles={['Admin', 'Manager']} // Multiple roles (any grants access)
  redirectTo="/unauthorized" // Redirect path if no access
  fallback={<NoAccess />} // Component to show if no access
>
  <AdminContent />
</RoleGuard>
```

### usePermission Hook

```jsx
const {
  hasPermission, // (permission: string) => boolean
  hasAnyPermission, // (permissions: string[]) => boolean
  hasAllPermissions, // (permissions: string[]) => boolean
  user, // Current user object
} = usePermission();
```

### useRole Hook

```jsx
const {
  hasRole, // (role: string) => boolean
  hasAnyRole, // (roles: string[]) => boolean
  user, // Current user object
} = useRole();
```

## Common Patterns

### Pattern 1: Multiple Action Buttons

```jsx
<div className="actions">
  <CanAccess permission={PERMISSIONS.LEADS_VIEW}>
    <Button onClick={view}>View</Button>
  </CanAccess>

  <CanAccess permission={PERMISSIONS.LEADS_EDIT}>
    <Button onClick={edit}>Edit</Button>
  </CanAccess>

  <CanAccess permission={PERMISSIONS.LEADS_DELETE}>
    <Button onClick={del}>Delete</Button>
  </CanAccess>
</div>
```

### Pattern 2: Admin-Only Section

```jsx
<RoleGuard roles={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
  <AdminSettings />
</RoleGuard>
```

### Pattern 3: Conditional Form Fields

```jsx
<Form>
  <Input name="name" />
  <Input name="email" />

  <CanAccess permission={PERMISSIONS.USERS_EDIT}>
    <Select name="role" options={roles} />
  </CanAccess>

  <CanAccess permission={PERMISSIONS.SETTINGS_ROLES}>
    <PermissionCheckboxes />
  </CanAccess>
</Form>
```

### Pattern 4: Dynamic Menu Items

```jsx
const menuItems = [
  { label: 'Dashboard', path: '/', permission: PERMISSIONS.DASHBOARD_VIEW },
  { label: 'Leads', path: '/leads', permission: PERMISSIONS.LEADS_VIEW },
  { label: 'Users', path: '/users', permission: PERMISSIONS.USERS_VIEW },
  { label: 'Settings', path: '/settings', permission: PERMISSIONS.SETTINGS_VIEW },
];

{
  menuItems.map((item) => (
    <CanAccess key={item.path} permission={item.permission}>
      <MenuItem to={item.path}>{item.label}</MenuItem>
    </CanAccess>
  ));
}
```

### Pattern 5: Feature Flags

```jsx
const { hasPermission } = usePermission();

const features = {
  canExport: hasPermission(PERMISSIONS.LEADS_EXPORT),
  canBulkEdit: hasPermission(PERMISSIONS.LEADS_EDIT),
  canManageTeam: hasPermission(PERMISSIONS.USERS_VIEW),
};

return (
  <div>
    {features.canExport && <ExportButton />}
    {features.canBulkEdit && <BulkActions />}
    {features.canManageTeam && <TeamManager />}
  </div>
);
```

## Tips & Tricks

### 1. Combining Permissions

```jsx
// Show if user has ANY of these permissions
<CanAccess permissions={[PERMISSIONS.LEADS_EDIT, PERMISSIONS.LEADS_DELETE]}>
  <ActionsMenu />
</CanAccess>

// Show if user has ALL of these permissions
<CanAccess
  permissions={[PERMISSIONS.LEADS_VIEW, PERMISSIONS.LEADS_EXPORT]}
  requireAll={true}
>
  <ExportButton />
</CanAccess>
```

### 2. Providing Fallback Content

```jsx
<CanAccess
  permission={PERMISSIONS.USERS_VIEW}
  fallback={<p>Contact admin for user management access</p>}
>
  <UsersList />
</CanAccess>
```

### 3. Redirecting on No Access

```jsx
<PermissionGuard permission={PERMISSIONS.SETTINGS_VIEW} redirectTo="/unauthorized">
  <Settings />
</PermissionGuard>
```

### 4. Using HOC for Entire Pages

```jsx
import { withPermission } from '../components/PermissionGuard';

const LeadsPage = () => <div>Leads</div>;

export default withPermission(LeadsPage, {
  permission: PERMISSIONS.LEADS_VIEW,
  redirectTo: '/unauthorized',
});
```

## Debugging

### Check Current User & Permissions

```jsx
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';

function DebugPermissions() {
  const user = useSelector(selectCurrentUser);

  console.log('User:', user);
  console.log('Role:', user?.role);
  console.log('Permissions:', user?.role?.permission);

  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
```

### Check Specific Permission

```jsx
import { hasPermission } from '../utils/permissions';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';

const user = useSelector(selectCurrentUser);
console.log('Can view leads:', hasPermission(user, PERMISSIONS.LEADS_VIEW));
```

---

**Quick Tip:** When in doubt, check the `RBAC_IMPLEMENTATION.md` for detailed documentation.
