# Input Components Documentation

## Overview

This project includes several input components built on top of shadcn/ui with enhanced functionality and proper styling.

## Components

### 1. Input (Base Component)

**File**: `src/components/ui/input.jsx`
**Description**: Enhanced version of shadcn/ui Input with fixed outline and padding issues.

**Features**:

- Fixed black outline issue
- Reduced horizontal padding
- Proper focus styles with blue ring
- Glass morphism background effect
- Hover and disabled states

**Usage**:

```jsx
import { Input } from "../components/ui/input";

<Input
  type="email"
  placeholder="Enter email"
  value={value}
  onChange={handleChange}
/>;
```

### 2. EnhancedInput

**File**: `src/components/ui/enhanced-input.jsx`
**Description**: Input wrapper with built-in icon support.

**Features**:

- Left/right icon positioning
- Automatic padding adjustment for icons
- All Input component features

**Usage**:

```jsx
import { EnhancedInput } from "../components/ui/enhanced-input";
import { Mail } from "lucide-react";

<EnhancedInput
  type="email"
  placeholder="Enter email"
  icon={Mail}
  iconPosition="left"
  value={value}
  onChange={handleChange}
/>;
```

### 3. FormInput (Recommended)

**File**: `src/components/ui/form-input.jsx`
**Description**: Complete form input with label, error handling, and flexible icon/element support.

**Features**:

- Built-in label support
- Error state handling and display
- Left/right icon support
- Custom right elements (like toggle buttons)
- Auto-generated IDs if not provided
- Customizable styling for all parts

**Props**:

- `label`: Input label text
- `error`: Error message to display
- `icon`: Lucide React icon component
- `iconPosition`: "left" | "right"
- `rightElement`: Custom React element for right side
- `containerClassName`: Container div styling
- `labelClassName`: Label styling
- `errorClassName`: Error message styling
- All standard input props

**Usage**:

```jsx
import { FormInput } from '../components/ui/form-input';
import { Mail, Eye, EyeOff } from 'lucide-react';

// Simple input with label and icon
<FormInput
  label="Email Address"
  type="email"
  placeholder="Enter your email"
  icon={Mail}
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>

// Password field with toggle visibility
<FormInput
  label="Password"
  type={showPassword ? 'text' : 'password'}
  placeholder="Enter password"
  icon={Lock}
  rightElement={
    <button onClick={() => setShowPassword(!showPassword)}>
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  }
  value={password}
  onChange={(e) => setPassword(e.target.value)}
/>

// With error state
<FormInput
  label="Email"
  type="email"
  error="Please enter a valid email address"
  value={email}
  onChange={handleChange}
/>
```

## Key Improvements Made

### Fixed Issues:

1. **Black outline problem**: Replaced default focus-visible styles with custom blue ring
2. **Excessive horizontal padding**: Reduced from px-4 to px-3
3. **Sharp corners**: Changed from rounded-md to rounded-lg
4. **Poor contrast**: Enhanced with glass morphism and proper hover states

### Enhanced Features:

1. **Icon integration**: Automatic padding adjustment when icons are used
2. **Form integration**: Built-in label and error handling
3. **Accessibility**: Proper labeling and error associations
4. **Flexibility**: Support for custom right elements
5. **Consistency**: All components use the same design system

### Global Usage:

The base `Input` component is automatically used by:

- AdminLayout search functionality
- Users page filters
- Any other existing Input usages

The `FormInput` component should be used for new form implementations as it provides the most comprehensive feature set.

## Best Practices

1. **Use FormInput for new forms** - It provides the most complete functionality
2. **Consistent icon usage** - Use Lucide React icons with 4x4 size (h-4 w-4)
3. **Error handling** - Always provide meaningful error messages
4. **Accessibility** - Labels are automatically associated with inputs
5. **Styling customization** - Use the className props for component-specific styling

## Example Implementation

See `src/views/Login.jsx` for a complete implementation example showing both email and password fields with icons and interactions.
