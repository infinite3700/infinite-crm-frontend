# Debugging Permission Issues

## Quick Debug Steps

If you're seeing the "Unauthorized" page even though the user has the correct permissions, follow these steps:

### Step 1: Check User Object in Redux

Open browser console and run:
```javascript
// Get current user from Redux store
const state = window.__REDUX_DEVTOOLS_EXTENSION__ ? 
  window.__REDUX_DEVTOOLS_EXTENSION__.store.getState() : 
  null;

console.log('Current User:', state?.auth?.user);
console.log('User Role:', state?.auth?.user?.role);
console.log('Permissions:', state?.auth?.user?.role?.permission || state?.auth?.user?.role?.permissions);
```

### Step 2: Check Permission Format

The backend can return permissions in different formats:

**Format 1: Array of Objects**
```javascript
{
  role: {
    name: "Manager",
    permission: [
      { key: "leads.read", name: "Read Leads" },
      { key: "leads.create", name: "Create Leads" }
    ]
  }
}
```

**Format 2: Array of Strings**
```javascript
{
  role: {
    name: "Manager",
    permission: ["leads.read", "leads.create", "leads.update"]
  }
}
```

**Format 3: Plural 'permissions'**
```javascript
{
  role: {
    name: "Manager",
    permissions: ["leads.read", "leads.create", "leads.update"]
  }
}
```

### Step 3: Enable Debug Logging

The `hasPermission()` function now logs debug information in development mode. Open browser console and you'll see:

```
[hasPermission] Checking permission: leads.read
[hasPermission] User role: Manager
[hasPermission] Role permissions: ["leads.read", "leads.create", "leads.update"]
[hasPermission] Result: true
```

### Step 4: Check localStorage

Open browser console and run:
```javascript
// Check what's stored
const token = localStorage.getItem('auth_token');
const userStr = localStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;

console.log('Token exists:', !!token);
console.log('User in localStorage:', user);
console.log('User role:', user?.role);
```

### Step 5: Check Backend Response

Open Network tab in browser DevTools:
1. Go to Network tab
2. Filter for "login" or the API endpoint
3. Click on the request
4. Look at the Response tab
5. Check the structure of the `role` object

Example backend response:
```json
{
  "status": true,
  "token": "eyJhbGc...",
  "_id": "123",
  "username": "manager1",
  "email": "manager@example.com",
  "name": "Manager User",
  "role": {
    "name": "Manager",
    "permission": ["leads.read", "leads.create", "leads.update"]
  }
}
```

### Step 6: Verify Permission Constants

Check that the frontend permission constants match the backend:

**Backend sends:**
- `leads.read`
- `leads.create`
- `leads.update`
- `leads.delete`

**Frontend checks:**
- `PERMISSIONS.LEADS_READ` = `'leads.read'` ✅
- `PERMISSIONS.LEADS_CREATE` = `'leads.create'` ✅
- `PERMISSIONS.LEADS_UPDATE` = `'leads.update'` ✅
- `PERMISSIONS.LEADS_DELETE` = `'leads.delete'` ✅

## Common Issues & Solutions

### Issue 1: User object doesn't have role.permission

**Symptom:**
```javascript
user.role = "Manager" // String instead of object
```

**Solution:**
Backend needs to populate the role with permissions. Check backend API response.

### Issue 2: Permissions field is named differently

**Symptom:**
```javascript
user.role = {
  name: "Manager",
  permissions: [...] // 'permissions' (plural) instead of 'permission'
}
```

**Solution:**
The updated `hasPermission()` function now checks both `permission` and `permissions` (plural).

### Issue 3: localStorage has stale data

**Symptom:**
After updating backend, permissions don't change.

**Solution:**
```javascript
// Clear localStorage and login again
localStorage.removeItem('auth_token');
localStorage.removeItem('user');
// Then login again
```

### Issue 4: Wrong permission key

**Symptom:**
Frontend checks `leads.view` but backend sends `leads.read`

**Solution:**
Make sure frontend uses the new CRUD-based permissions:
- Use `PERMISSIONS.LEADS_READ` not `PERMISSIONS.LEADS_VIEW`
- The code has backward compatibility, so `LEADS_VIEW` is aliased to `LEADS_READ`

### Issue 5: Role name doesn't match

**Symptom:**
```javascript
// Backend sends
role.name = "Manager"

// Frontend expects
ROLES.MANAGER = "Manager" ✅ Match!

// But sometimes backend sends
role.name = "manager" // lowercase

// Frontend expects
ROLES.MANAGER = "Manager" // Uppercase first letter
```

**Solution:**
Ensure role names match exactly (case-sensitive).

## Testing Permissions

### Test 1: Basic Permission Check

Open browser console:
```javascript
// Import from window (if exposed) or check manually
const user = {
  role: {
    name: "Manager",
    permission: ["leads.read", "leads.create", "leads.update"]
  }
};

// Manual check
console.log('Has leads.read?', user.role.permission.includes('leads.read'));
console.log('Has leads.delete?', user.role.permission.includes('leads.delete'));
```

### Test 2: Check All Permissions

```javascript
const state = window.__REDUX_DEVTOOLS_EXTENSION__?.store.getState();
const user = state?.auth?.user;
const permissions = user?.role?.permission || user?.role?.permissions || [];

console.log('User has these permissions:', permissions);
console.log('User role:', user?.role?.name);
```

### Test 3: Check Specific Route Permission

```javascript
// Example: Check if user can access /leads
const PERMISSIONS = {
  LEADS_READ: 'leads.read',
  LEADS_VIEW: 'leads.read', // Alias
};

const state = window.__REDUX_DEVTOOLS_EXTENSION__?.store.getState();
const user = state?.auth?.user;
const permissions = user?.role?.permission || user?.role?.permissions || [];

const canAccessLeads = permissions.includes(PERMISSIONS.LEADS_READ);
console.log('Can access /leads?', canAccessLeads);
```

## Fixed Issues

### ✅ Multi-Format Support

The `hasPermission()` function now handles:
1. `role.permission` (singular) as array of objects
2. `role.permission` (singular) as array of strings
3. `role.permissions` (plural) as array of objects
4. `role.permissions` (plural) as array of strings

### ✅ Debug Logging

Development mode now shows detailed logs:
- What permission is being checked
- What role the user has
- What permissions the role has
- The result (true/false)

### ✅ Backward Compatibility

Old permission names still work:
- `PERMISSIONS.LEADS_VIEW` → `leads.read`
- `PERMISSIONS.LEADS_EDIT` → `leads.update`

## Quick Fix Checklist

- [ ] Check browser console for debug logs
- [ ] Verify user object in Redux has `role.permission` or `role.permissions`
- [ ] Check that permissions are an array
- [ ] Verify permission keys match backend (e.g., `leads.read` not `lead.read`)
- [ ] Clear localStorage and re-login if needed
- [ ] Check Network tab for actual backend response
- [ ] Ensure role name matches exactly (case-sensitive)

## Current User Scenario

**User has permissions:**
```javascript
["leads.read", "leads.create", "leads.update"]
```

**Expected behavior:**
- ✅ Can access `/leads` (requires `leads.read`)
- ✅ Can access `/leads/new` (requires `leads.create`)  
- ✅ Can access `/leads/:id/edit` (requires `leads.update`)
- ❌ Cannot see delete button (requires `leads.delete`)

**If seeing unauthorized:**
1. Check that `role.permission` or `role.permissions` exists
2. Check that it's an array: `["leads.read", ...]`
3. Check browser console for `[hasPermission]` debug logs
4. Verify the permission being checked matches what user has

## Need More Help?

Run this comprehensive debug script in browser console:

```javascript
// Comprehensive permission debug
const state = window.__REDUX_DEVTOOLS_EXTENSION__?.store.getState();
const user = state?.auth?.user;

console.group('🔍 Permission Debug Info');
console.log('1. User object:', user);
console.log('2. Role:', user?.role);
console.log('3. Role name:', user?.role?.name);
console.log('4. Permissions (permission):', user?.role?.permission);
console.log('5. Permissions (permissions):', user?.role?.permissions);
console.log('6. Is authenticated:', state?.auth?.isAuthenticated);
console.log('7. Is initialized:', state?.auth?.initialized);
console.log('8. Token exists:', !!state?.auth?.token);

// Check localStorage
const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('auth_token');
console.log('9. User in localStorage:', storedUser ? JSON.parse(storedUser) : null);
console.log('10. Token in localStorage:', !!storedToken);

console.groupEnd();
```

Copy the output and share it for further debugging!

