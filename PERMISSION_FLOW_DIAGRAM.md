# Permission Flow Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER LOGIN & AUTHENTICATION                   │
│                                                                   │
│  1. User logs in via Login page                                  │
│  2. Backend validates credentials                                │
│  3. Backend returns user object with role & permissions          │
│  4. Redux authSlice stores user data                             │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CENTRALIZED CONFIGURATION                        │
│                                                                   │
│  src/utils/permissions.js                                        │
│  ├─ PERMISSIONS (constants)                                      │
│  ├─ ROLES (constants)                                            │
│  ├─ DEFAULT_ROLE_PERMISSIONS (mapping)                           │
│  └─ hasPermission() function                                     │
│                                                                   │
│  src/config/navigation.js                                        │
│  ├─ MAIN_NAVIGATION (sidebar)                                    │
│  ├─ MOBILE_NAVIGATION (bottom nav)                               │
│  ├─ SETTINGS_TABS (settings tabs)                                │
│  └─ filterNavigation() function                                  │
└─────────────────────────────┬───────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PERMISSION CHECKS HAPPEN AT                    │
│                                                                   │
│  1. ROUTE LEVEL (AppRouter.jsx)                                  │
│     └─ PermissionGuard wraps routes                              │
│                                                                   │
│  2. LAYOUT LEVEL (AdminLayout.jsx)                               │
│     └─ Filters navigation menu items                             │
│                                                                   │
│  3. PAGE LEVEL (Settings.jsx, etc.)                              │
│     └─ Filters tabs and sections                                 │
│                                                                   │
│  4. COMPONENT LEVEL (Buttons, Actions)                           │
│     └─ CanAccess component wraps UI elements                     │
└───────────────────────────────────────────────────────────────── ┘
```

## Detailed Permission Flow

### 1. User Authentication Flow

```
Login Page
    │
    ├─► authService.login(credentials)
    │
    ├─► Backend API validates
    │
    ├─► Returns: { user: {..., role: { name, permission: [...] }}, token }
    │
    ├─► Redux: authSlice.login.fulfilled
    │
    └─► Store user with full role object in Redux state
```

### 2. Navigation Rendering Flow

```
AdminLayout Component
    │
    ├─► Import: MAIN_NAVIGATION, MOBILE_NAVIGATION, filterNavigation
    │
    ├─► Get currentUser from Redux: useSelector(selectCurrentUser)
    │
    ├─► Filter navigation:
    │   filterNavigation(MAIN_NAVIGATION, currentUser, hasPermission)
    │   │
    │   └─► For each item:
    │       ├─ Check if permission is null → Show (public to authenticated)
    │       ├─ Check hasPermission(user, item.permission)
    │       │   └─► Check user.role.permission array
    │       └─ Return filtered list
    │
    └─► Render only accessible navigation items
```

### 3. Settings Tabs Flow

```
Settings Component
    │
    ├─► Import: SETTINGS_TABS, getAccessibleSettingsTabs
    │
    ├─► Get currentUser from Redux: useSelector(selectCurrentUser)
    │
    ├─► Get accessible tabs:
    │   getAccessibleSettingsTabs(currentUser, hasPermission)
    │   │
    │   └─► Internally calls filterNavigation(SETTINGS_TABS, user, hasPermission)
    │
    ├─► Map tabs to TAB_COMPONENTS
    │
    └─► Render only accessible tabs
```

### 4. Route Protection Flow

```
User navigates to /leads
    │
    ├─► AppRouter checks route
    │
    ├─► Route wrapped in PermissionGuard
    │   <PermissionGuard permission={PERMISSIONS.LEADS_VIEW}>
    │       <Leads />
    │   </PermissionGuard>
    │
    ├─► PermissionGuard checks:
    │   │
    │   ├─► Is auth initialized? → If no, show LoadingSpinner
    │   │
    │   ├─► Is user logged in? → If no, redirect to /unauthorized
    │   │
    │   ├─► hasPermission(user, PERMISSIONS.LEADS_VIEW)?
    │   │   │
    │   │   ├─► YES → Render <Leads />
    │   │   │
    │   │   └─► NO → Redirect to /unauthorized
    │
    └─► Component renders or user redirected
```

### 5. UI Element Protection Flow

```
Component with Action Buttons
    │
    ├─► Import: CanAccess, PERMISSIONS
    │
    ├─► Wrap sensitive UI elements:
    │   <CanAccess permission={PERMISSIONS.LEADS_CREATE}>
    │       <Button>Add Lead</Button>
    │   </CanAccess>
    │
    ├─► CanAccess internally:
    │   │
    │   ├─► Get currentUser from Redux
    │   │
    │   ├─► Check hasPermission(user, permission)
    │   │   │
    │   │   ├─► YES → Render children (button visible)
    │   │   │
    │   │   └─► NO → Render fallback (null, button hidden)
    │
    └─► User sees only allowed actions
```

## Permission Check Logic

### hasPermission() Function Flow

```
hasPermission(user, permission)
    │
    ├─► Check: Is user null? → Return false
    │
    ├─► Check: Is user.role null? → Return false
    │
    ├─► Extract role information:
    │   ├─ roleName = role.name (if object) or role (if string)
    │   └─ rolePermissions = role.permission array
    │
    ├─► Check: Is Super Admin? → Return true (all access)
    │
    ├─► Check: Does rolePermissions include permission?
    │   ├─► YES → Return true
    │   │
    │   └─► NO → Check DEFAULT_ROLE_PERMISSIONS[roleName]
    │       └─► Return true if found, false otherwise
    │
    └─► Return result
```

## Example: Employee Role Flow

```
Employee User Login
    │
    └─► user.role = { name: "Employee", permission: ["dashboard.view"] }

Navigation Check
    │
    ├─► Dashboard (PERMISSIONS.DASHBOARD_VIEW)
    │   └─► hasPermission(user, "dashboard.view") → ✅ TRUE → SHOW
    │
    ├─► Users (PERMISSIONS.USERS_VIEW)
    │   └─► hasPermission(user, "users.view") → ❌ FALSE → HIDE
    │
    ├─► Leads (PERMISSIONS.LEADS_VIEW)
    │   └─► hasPermission(user, "leads.view") → ❌ FALSE → HIDE
    │
    ├─► Campaigns (PERMISSIONS.CAMPAIGNS_VIEW)
    │   └─► hasPermission(user, "campaigns.view") → ❌ FALSE → HIDE
    │
    └─► Settings (PERMISSIONS.SETTINGS_VIEW)
        └─► hasPermission(user, "settings.view") → ❌ FALSE → HIDE

Result: Employee sees ONLY Dashboard in sidebar
```

```
Settings Tabs Check (if Settings was accessible)
    │
    ├─► Profile Tab (permission: null)
    │   └─► No permission check → ✅ SHOW (accessible to all)
    │
    ├─► Geography Tab (PERMISSIONS.SETTINGS_GEOGRAPHY)
    │   └─► hasPermission(user, "settings.geography") → ❌ FALSE → HIDE
    │
    ├─► Lead Stages Tab (PERMISSIONS.SETTINGS_LEAD_STAGES)
    │   └─► hasPermission(user, "settings.leadStages") → ❌ FALSE → HIDE
    │
    ├─► Products Tab (PERMISSIONS.SETTINGS_PRODUCTS)
    │   └─► hasPermission(user, "settings.products") → ❌ FALSE → HIDE
    │
    └─► Roles Tab (PERMISSIONS.SETTINGS_ROLES)
        └─► hasPermission(user, "settings.roles") → ❌ FALSE → HIDE

Result: Would see ONLY Profile tab (but Settings itself is hidden)
```

## Component Hierarchy

```
App.jsx
  │
  └─► AppRouter.jsx
      │
      ├─► Public Routes (Login, etc.)
      │
      └─► ProtectedRoute
          │
          └─► AdminLayout.jsx
              │
              ├─► Sidebar (Desktop)
              │   └─► Filtered MAIN_NAVIGATION items
              │
              ├─► Bottom Nav (Mobile)
              │   └─► Filtered MOBILE_NAVIGATION items
              │
              └─► <Outlet /> (Renders route content)
                  │
                  ├─► Dashboard (PermissionGuard)
                  ├─► Users (PermissionGuard)
                  ├─► Leads (PermissionGuard)
                  │   └─► Action buttons (CanAccess)
                  ├─► Campaigns (PermissionGuard)
                  └─► Settings (PermissionGuard)
                      └─► Tabs (filtered by permissions)
                          └─► Tab actions (CanAccess)
```

## Key Files and Their Roles

```
┌────────────────────────────────────────────────────────────────┐
│ CONFIGURATION LAYER                                             │
├────────────────────────────────────────────────────────────────┤
│ src/utils/permissions.js     → Permission constants & helpers  │
│ src/config/navigation.js     → Navigation & tabs config        │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ PROTECTION LAYER                                                │
├────────────────────────────────────────────────────────────────┤
│ src/components/PermissionGuard.jsx  → Route-level protection   │
│ src/components/CanAccess.jsx        → UI element protection    │
│ src/components/RoleGuard.jsx        → Role-based protection    │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ IMPLEMENTATION LAYER                                            │
├────────────────────────────────────────────────────────────────┤
│ src/layouts/AdminLayout.jsx       → Sidebar filtering          │
│ src/views/Settings.jsx            → Settings tabs filtering    │
│ src/views/Leads.jsx               → Action button protection   │
│ src/components/settings/*.jsx     → Tab-level protection       │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ STATE MANAGEMENT                                                │
├────────────────────────────────────────────────────────────────┤
│ src/store/authSlice.js           → User & auth state           │
│ src/api/authService.js           → Login & auth API            │
└────────────────────────────────────────────────────────────────┘
```

## Summary

**Single Source of Truth:** All navigation and permissions are centrally configured

**Multiple Protection Layers:**
1. Route protection (PermissionGuard)
2. Navigation filtering (filterNavigation)
3. Tab filtering (getAccessibleSettingsTabs)
4. UI element protection (CanAccess)

**Consistent Behavior:** Same permission check logic everywhere via `hasPermission()`

**Easy Maintenance:** Add new items in `navigation.js`, permissions automatically apply

