# Navigation & Permission Configuration Guide

## Overview

This guide explains how navigation menus, settings tabs, and permissions are centrally managed in the Infinite CRM application. All navigation and menu configurations are now centralized in `src/config/navigation.js`, making it easy to maintain and ensure consistency across the application.

## Architecture

### Centralized Configuration File

**Location:** `src/config/navigation.js`

This file contains:
- Main sidebar navigation configuration
- Mobile bottom navigation configuration
- Settings page tabs configuration
- Helper functions for filtering based on permissions

### Key Components

1. **`MAIN_NAVIGATION`** - Desktop/Tablet sidebar menu items
2. **`MOBILE_NAVIGATION`** - Mobile bottom navigation items (includes Follow Up)
3. **`SETTINGS_TABS`** - Settings page tabs configuration
4. **Helper Functions** - `filterNavigation()`, `getAccessibleSettingsTabs()`, `getFirstAccessibleRoute()`

## Configuration Structure

### Navigation Item Schema

```javascript
{
  id: 'unique-identifier',      // Unique ID for the item
  name: 'Display Name',          // Name shown in the menu
  href: '/route-path',           // Route path
  icon: IconComponent,           // Lucide icon component
  permission: PERMISSIONS.KEY,   // Permission required (null = accessible to all)
}
```

### Settings Tab Schema

```javascript
{
  id: 'tab-id',                    // Unique tab ID
  label: 'Full Label',             // Full label shown on desktop
  shortLabel: 'Short',             // Shortened label for mobile
  icon: IconComponent,             // Lucide icon component
  permission: PERMISSIONS.KEY,     // Permission required (null = accessible to all)
}
```

## How It Works

### 1. Define Navigation Items

Navigation items are defined in `src/config/navigation.js`:

```javascript
export const MAIN_NAVIGATION = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    href: '/',
    icon: Home,
    permission: PERMISSIONS.DASHBOARD_VIEW,
  },
  // ... more items
];
```

### 2. Permission-Based Filtering

The `filterNavigation()` function automatically filters items based on user permissions:

```javascript
const filteredNavigation = filterNavigation(
  MAIN_NAVIGATION,
  currentUser,
  hasPermission
);
```

**How it works:**
- Checks if user exists
- For each navigation item:
  - If `permission` is `null` → Always show (authenticated users)
  - If `permission` is set → Check if user has that permission
- Returns only accessible items

### 3. Usage in Components

#### AdminLayout (Sidebar)

```javascript
import { MAIN_NAVIGATION, MOBILE_NAVIGATION, filterNavigation } from '../config/navigation';
import { hasPermission } from '../utils/permissions';

const filteredNavigation = filterNavigation(MAIN_NAVIGATION, currentUser, hasPermission);
const filteredMobileNavigation = filterNavigation(MOBILE_NAVIGATION, currentUser, hasPermission);
```

#### Settings Page (Tabs)

```javascript
import { SETTINGS_TABS, getAccessibleSettingsTabs } from '../config/navigation';
import { hasPermission } from '../utils/permissions';

const tabs = getAccessibleSettingsTabs(currentUser, hasPermission);
```

## Permission System Integration

### Permission Constants

All permissions are defined in `src/utils/permissions.js`:

```javascript
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  LEADS_VIEW: 'leads.view',
  LEADS_CREATE: 'leads.create',
  LEADS_EDIT: 'leads.edit',
  LEADS_DELETE: 'leads.delete',
  USERS_VIEW: 'users.view',
  CAMPAIGNS_VIEW: 'campaigns.view',
  SETTINGS_VIEW: 'settings.view',
  SETTINGS_PRODUCTS: 'settings.products',
  SETTINGS_ROLES: 'settings.roles',
  // ... more permissions
};
```

### Role-Permission Mapping

Roles and their permissions are mapped in `DEFAULT_ROLE_PERMISSIONS`:

```javascript
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS), // All permissions
  [ROLES.ADMIN]: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.LEADS_VIEW,
    PERMISSIONS.LEADS_CREATE,
    // ... more permissions
  ],
  [ROLES.EMPLOYEE]: [
    PERMISSIONS.DASHBOARD_VIEW,
    // Limited permissions
  ],
};
```

## Adding New Navigation Items

### Step 1: Add Permission (if needed)

In `src/utils/permissions.js`:

```javascript
export const PERMISSIONS = {
  // ... existing permissions
  REPORTS_VIEW: 'reports.view',
  REPORTS_CREATE: 'reports.create',
};
```

### Step 2: Add to Role Permissions

```javascript
export const DEFAULT_ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // ... existing permissions
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_CREATE,
  ],
};
```

### Step 3: Add Navigation Item

In `src/config/navigation.js`:

```javascript
import { FileText } from 'lucide-react'; // Import icon

export const MAIN_NAVIGATION = [
  // ... existing items
  {
    id: 'reports',
    name: 'Reports',
    href: '/reports',
    icon: FileText,
    permission: PERMISSIONS.REPORTS_VIEW,
  },
];
```

### Step 4: Add Route Protection

In `src/routes/AppRouter.jsx`:

```javascript
<Route
  path="reports"
  element={
    <PermissionGuard permission={PERMISSIONS.REPORTS_VIEW}>
      <Reports />
    </PermissionGuard>
  }
/>
```

**That's it!** The navigation item will automatically:
- ✅ Show in sidebar for users with `reports.view` permission
- ✅ Hide from users without permission
- ✅ Protect the route with `PermissionGuard`

## Adding New Settings Tabs

### Step 1: Create Tab Component

Create `src/components/settings/NewTab.jsx`:

```javascript
import React from 'react';

const NewTab = () => {
  return (
    <div>
      {/* Tab content */}
    </div>
  );
};

export default NewTab;
```

### Step 2: Add to Settings Tabs Config

In `src/config/navigation.js`:

```javascript
import { Icon } from 'lucide-react';

export const SETTINGS_TABS = [
  // ... existing tabs
  {
    id: 'new-tab',
    label: 'New Tab',
    shortLabel: 'New',
    icon: Icon,
    permission: PERMISSIONS.SETTINGS_NEW_TAB,
  },
];
```

### Step 3: Register Tab Component

In `src/views/Settings.jsx`:

```javascript
import NewTab from '../components/settings/NewTab';

const TAB_COMPONENTS = {
  'profile': ProfileTab,
  'geography': GeographyTab,
  // ... existing tabs
  'new-tab': NewTab,
};
```

**Done!** The tab will automatically show/hide based on permissions.

## Best Practices

### ✅ DO

1. **Always define permissions** for sensitive routes and tabs
2. **Use meaningful permission keys** (e.g., `module.action`)
3. **Set `permission: null`** for items accessible to all authenticated users
4. **Use centralized configuration** instead of hardcoding menus
5. **Test with different roles** to ensure proper access control
6. **Keep shortLabel concise** for mobile displays (1-2 words)

### ❌ DON'T

1. **Don't hardcode navigation items** in components
2. **Don't skip route protection** when adding new routes
3. **Don't forget to add permissions to roles** in `DEFAULT_ROLE_PERMISSIONS`
4. **Don't create duplicate permission keys**
5. **Don't bypass permission checks** in components

## Testing Permissions

### Manual Testing

1. Create test users with different roles
2. Login as each user
3. Verify:
   - Correct menu items are visible
   - Correct settings tabs are shown
   - Routes are properly protected
   - Buttons/actions respect permissions

### Test Scenarios

| Role | Should See | Should NOT See |
|------|-----------|----------------|
| Super Admin | All items | Nothing hidden |
| Admin | Most items | Some advanced settings |
| Manager | Leads, Campaigns, Reports | User management, Role settings |
| Sales Rep | Leads, Tasks | Settings, User management |
| Employee | Dashboard only | Everything else |
| Viewer | Read-only access | Create/Edit/Delete actions |

## Troubleshooting

### Navigation item not showing

**Check:**
1. ✓ Permission is defined in `PERMISSIONS`
2. ✓ Permission is added to user's role in `DEFAULT_ROLE_PERMISSIONS`
3. ✓ User object has correct role with permissions
4. ✓ `permission` field in navigation config matches exactly

### Settings tab not showing

**Check:**
1. ✓ Tab is added to `SETTINGS_TABS` in `navigation.js`
2. ✓ Component is imported and registered in `TAB_COMPONENTS`
3. ✓ Permission is correctly set and user has access
4. ✓ Component file exists and exports properly

### User sees items they shouldn't

**Check:**
1. ✓ Backend is returning correct role and permissions
2. ✓ Redux state is properly updated after login
3. ✓ `hasPermission()` function is working correctly
4. ✓ Permission checks are not bypassed anywhere

## Advanced Usage

### Conditional Navigation

You can add custom logic in the filter function:

```javascript
const customFilteredNav = MAIN_NAVIGATION.filter(item => {
  // Custom logic
  if (item.id === 'special-feature' && !user.hasSpecialAccess) {
    return false;
  }
  return filterNavigation([item], user, hasPermission).length > 0;
});
```

### Dynamic Navigation Counts

Add badge counts to navigation items:

```javascript
// In AdminLayout.jsx
const navWithCounts = filteredNavigation.map(item => ({
  ...item,
  count: item.id === 'leads' ? leadCounts.assignedCount : null,
}));
```

### Smart Redirects

Use `getFirstAccessibleRoute()` for redirects:

```javascript
import { getFirstAccessibleRoute } from '../config/navigation';

const redirectPath = getFirstAccessibleRoute(currentUser, hasPermission);
navigate(redirectPath);
```

## Related Files

- **`src/config/navigation.js`** - Main configuration file
- **`src/utils/permissions.js`** - Permission constants and helpers
- **`src/layouts/AdminLayout.jsx`** - Sidebar implementation
- **`src/views/Settings.jsx`** - Settings tabs implementation
- **`src/components/PermissionGuard.jsx`** - Route protection
- **`src/components/CanAccess.jsx`** - UI element protection

## Summary

The centralized navigation configuration system provides:

✅ **Single Source of Truth** - One place to manage all navigation and menus
✅ **Automatic Permission Filtering** - Items automatically show/hide based on user permissions
✅ **Easy Maintenance** - Add new items in one place
✅ **Type Safety** - Consistent structure across the app
✅ **Testability** - Easy to test permission-based access
✅ **Flexibility** - Helper functions for custom use cases

By using this system, you ensure consistent permission handling across the entire application.

