# Quick Start Guide - Centralized Navigation System

## 🎯 What Was Done

We've implemented a **centralized navigation and permission mapping system** that controls:
- Sidebar menu items (desktop)
- Bottom navigation (mobile)
- Settings page tabs
- Action buttons throughout the app

**All based on user roles and permissions!**

## 🚀 Quick Overview

### Before
```javascript
// Navigation hardcoded in each component
const navigation = [
  { name: 'Dashboard', href: '/', icon: Home, ... },
  { name: 'Leads', href: '/leads', icon: UserCheck, ... },
  // ... more items
];
// Permission checks scattered everywhere
```

### After
```javascript
// Single centralized config file
import { MAIN_NAVIGATION, filterNavigation } from '../config/navigation';
const filteredNav = filterNavigation(MAIN_NAVIGATION, currentUser, hasPermission);
// Automatically filtered based on permissions!
```

## 📁 Key Files

### New Files
1. **`src/config/navigation.js`** ⭐ Main config file
2. **`NAVIGATION_CONFIG_GUIDE.md`** 📖 Complete usage guide
3. **`PERMISSION_FLOW_DIAGRAM.md`** 📊 Visual flow diagrams
4. **`IMPLEMENTATION_SUMMARY.md`** 📋 Detailed changes
5. **`QUICK_START.md`** ⚡ This file

### Modified Files
1. **`src/layouts/AdminLayout.jsx`** - Uses centralized navigation
2. **`src/views/Settings.jsx`** - Uses centralized tabs config
3. **`src/components/settings/ProductsTab.jsx`** - Protected actions

## 🎓 How to Use

### Add a New Navigation Item

**Step 1:** Add to `src/config/navigation.js`
```javascript
import { NewIcon } from 'lucide-react';

export const MAIN_NAVIGATION = [
  // ... existing items
  {
    id: 'new-item',
    name: 'New Item',
    href: '/new-item',
    icon: NewIcon,
    permission: PERMISSIONS.NEW_ITEM_VIEW, // or null for public
  },
];
```

**Step 2:** Add route protection in `src/routes/AppRouter.jsx`
```javascript
<Route
  path="new-item"
  element={
    <PermissionGuard permission={PERMISSIONS.NEW_ITEM_VIEW}>
      <NewItemPage />
    </PermissionGuard>
  }
/>
```

**Done!** The item automatically:
- ✅ Shows in sidebar for users with permission
- ✅ Hides from users without permission
- ✅ Redirects unauthorized users

### Add a New Settings Tab

**Step 1:** Create component in `src/components/settings/NewTab.jsx`
```javascript
const NewTab = () => {
  return <div>Tab content</div>;
};
export default NewTab;
```

**Step 2:** Add to `src/config/navigation.js`
```javascript
export const SETTINGS_TABS = [
  // ... existing tabs
  {
    id: 'new-tab',
    label: 'New Tab',
    shortLabel: 'New',
    icon: IconComponent,
    permission: PERMISSIONS.SETTINGS_NEW_TAB,
  },
];
```

**Step 3:** Register in `src/views/Settings.jsx`
```javascript
const TAB_COMPONENTS = {
  // ... existing
  'new-tab': NewTab,
};
```

**Done!** Tab automatically shows/hides based on permissions.

### Protect UI Elements

Wrap any button/action with `CanAccess`:
```javascript
import CanAccess from '../components/CanAccess';
import { PERMISSIONS } from '../utils/permissions';

<CanAccess permission={PERMISSIONS.LEADS_CREATE}>
  <Button onClick={handleCreate}>Create Lead</Button>
</CanAccess>
```

## 🔍 Testing Roles

### Employee Role (Minimal Access)
**Login as:** Employee user
**Expected:** 
- ✅ See Dashboard only
- ❌ No other menu items
- ❌ Cannot access Settings
- ❌ Cannot create/edit anything

### Admin Role (Full Access)
**Login as:** Admin user
**Expected:**
- ✅ See all menu items
- ✅ See all Settings tabs including Roles & Permissions
- ✅ Can manage roles and permissions
- ✅ Can perform most CRUD operations

### Super Admin Role (Complete Access)
**Login as:** Super Admin user
**Expected:**
- ✅ See everything
- ✅ All Settings tabs visible
- ✅ Can perform all actions
- ✅ No restrictions

## 📊 Current Configuration

### Sidebar Navigation Items
1. **Dashboard** - `PERMISSIONS.DASHBOARD_VIEW`
2. **Users** - `PERMISSIONS.USERS_VIEW`
3. **Leads** - `PERMISSIONS.LEADS_VIEW`
4. **Campaigns** - `PERMISSIONS.CAMPAIGNS_VIEW`
5. **Settings** - `PERMISSIONS.SETTINGS_VIEW`

### Mobile Bottom Navigation
1. **Dashboard** - `PERMISSIONS.DASHBOARD_VIEW`
2. **Leads** - `PERMISSIONS.LEADS_VIEW`
3. **Follow Up** - `PERMISSIONS.LEADS_VIEW`
4. **Campaigns** - `PERMISSIONS.CAMPAIGNS_VIEW`
5. **Settings** - `PERMISSIONS.SETTINGS_VIEW`

### Settings Tabs
1. **Profile** - `null` (Everyone can access)
2. **Geography** - `PERMISSIONS.SETTINGS_GEOGRAPHY`
3. **Lead Stages** - `PERMISSIONS.SETTINGS_LEAD_STAGES`
4. **Products & Categories** - `PERMISSIONS.SETTINGS_PRODUCTS`
5. **Roles & Permissions** - `PERMISSIONS.SETTINGS_ROLES`

## 🛡️ Security Layers

The system has **4 layers** of protection:

```
Layer 1: Route Protection (PermissionGuard)
         ↓ User tries to access /leads
         ↓ Check permission
         ↓ Allow or Redirect to /unauthorized

Layer 2: Navigation Filtering (filterNavigation)
         ↓ Render sidebar
         ↓ Filter items by permission
         ↓ Show only accessible items

Layer 3: Tab Filtering (getAccessibleSettingsTabs)
         ↓ Render Settings page
         ↓ Filter tabs by permission
         ↓ Show only accessible tabs

Layer 4: UI Element Protection (CanAccess)
         ↓ Render action buttons
         ↓ Check permission
         ↓ Show or hide button
```

## 🔧 Common Tasks

### Check User Permissions
```javascript
import { hasPermission, PERMISSIONS } from '../utils/permissions';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/authSlice';

const currentUser = useSelector(selectCurrentUser);
const canEdit = hasPermission(currentUser, PERMISSIONS.LEADS_EDIT);
```

### Get User's Accessible Routes
```javascript
import { getFirstAccessibleRoute } from '../config/navigation';

const firstRoute = getFirstAccessibleRoute(currentUser, hasPermission);
navigate(firstRoute); // Smart redirect
```

### Get Accessible Navigation
```javascript
import { filterNavigation, MAIN_NAVIGATION } from '../config/navigation';

const accessibleItems = filterNavigation(MAIN_NAVIGATION, currentUser, hasPermission);
```

## 📖 Further Reading

- **`NAVIGATION_CONFIG_GUIDE.md`** - Complete guide with examples
- **`PERMISSION_FLOW_DIAGRAM.md`** - Visual flow diagrams
- **`IMPLEMENTATION_SUMMARY.md`** - Technical details
- **`RBAC_QUICK_REFERENCE.md`** - RBAC system reference
- **`RBAC_IMPLEMENTATION.md`** - RBAC implementation details

## ✅ Verification

To verify everything is working:

1. **Run the app:** `npm run dev` (Running on http://localhost:5174/)
2. **Login with different roles:**
   - Employee user → See only Dashboard
   - Admin user → See most items except some settings
   - Super Admin → See everything
3. **Check navigation:**
   - Sidebar shows correct items
   - Mobile bottom nav shows correct items
   - Settings tabs show correct tabs
4. **Try accessing restricted routes:**
   - Should redirect to `/unauthorized`
5. **Check action buttons:**
   - Hidden for users without permission
   - Visible for users with permission

## 🎉 Benefits

✅ **Centralized** - One place to manage all navigation
✅ **Secure** - Multiple protection layers
✅ **Maintainable** - Easy to add/modify items
✅ **Consistent** - Same permission logic everywhere
✅ **Scalable** - Easy to add new roles/permissions
✅ **Well-documented** - Comprehensive guides

## 🆘 Troubleshooting

### Menu item not showing?
1. Check permission is defined in `PERMISSIONS`
2. Check user role has that permission
3. Check navigation config has correct permission
4. Check user object in Redux state

### Settings tab not showing?
1. Check tab in `SETTINGS_TABS` config
2. Check component mapping in `TAB_COMPONENTS`
3. Check user has the permission
4. Check component file exists

### Still seeing restricted items?
1. Check backend returns correct permissions
2. Check Redux state has correct user data
3. Check permission checks are not bypassed
4. Clear browser cache and re-login

## 💡 Pro Tips

1. **Always use centralized config** - Don't hardcode navigation items
2. **Use `permission: null`** for items accessible to all authenticated users
3. **Test with multiple roles** before deploying
4. **Use `CanAccess`** for UI elements, `PermissionGuard` for routes
5. **Keep permissions granular** (module.action format)

## 🚦 Status

✅ **Centralized navigation config created**
✅ **AdminLayout updated to use config**
✅ **Settings updated to use config**
✅ **ProductsTab actions protected**
✅ **No linting errors**
✅ **Dev server running successfully**
✅ **Documentation complete**

---

**Ready to use!** 🎊

For questions or issues, refer to the comprehensive guides or check the implementation in the files listed above.

