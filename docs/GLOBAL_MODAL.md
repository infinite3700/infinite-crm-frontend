# GlobalModal Component

The `GlobalModal` is a reusable modal component that provides a consistent modal experience across the entire application. It features a common header, scrollable content area, and configurable action buttons.

## Features

- **Common Header**: Title, description, optional icon, and close button
- **Scrollable Content**: Content area automatically becomes scrollable when needed
- **Flexible Actions**: Configurable footer buttons with loading states
- **Multiple Sizes**: Support for different modal sizes (sm, md, lg, xl, 2xl, 3xl)
- **Header Themes**: Different header background styles for various use cases
- **Accessibility**: Built-in keyboard navigation and focus management
- **Backdrop Control**: Configurable backdrop click behavior

## Basic Usage

```jsx
import { GlobalModal } from "../ui";

<GlobalModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Modal Title"
  description="Optional description"
  actions={[
    {
      label: "Cancel",
      variant: "outline",
      onClick: () => setIsModalOpen(false),
    },
    { label: "Save", variant: "default", onClick: handleSave },
  ]}
>
  <p>Your modal content goes here</p>
</GlobalModal>;
```

## Props

| Prop               | Type                                              | Default     | Description                             |
| ------------------ | ------------------------------------------------- | ----------- | --------------------------------------- |
| `isOpen`           | `boolean`                                         | -           | Controls modal visibility               |
| `onClose`          | `function`                                        | -           | Function called when modal should close |
| `title`            | `string`                                          | -           | Modal title in header                   |
| `description`      | `string`                                          | -           | Optional modal description              |
| `children`         | `ReactNode`                                       | -           | Modal content                           |
| `actions`          | `Array<ActionConfig>`                             | `[]`        | Array of action button configurations   |
| `size`             | `'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl'`  | `'md'`      | Modal size                              |
| `closeOnBackdrop`  | `boolean`                                         | `true`      | Whether clicking backdrop closes modal  |
| `showCloseButton`  | `boolean`                                         | `true`      | Whether to show X close button          |
| `headerClassName`  | `string`                                          | `''`        | Additional CSS classes for header       |
| `contentClassName` | `string`                                          | `''`        | Additional CSS classes for content      |
| `footerClassName`  | `string`                                          | `''`        | Additional CSS classes for footer       |
| `headerIcon`       | `ReactNode`                                       | -           | Icon to display in header               |
| `headerBg`         | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Header background style                 |

## Action Configuration

Each action button is configured with an object containing:

```typescript
interface ActionConfig {
  label: string; // Button text
  onClick: () => void; // Click handler
  variant?: "default" | "outline" | "destructive" | "ghost" | "gradient"; // Button style
  size?: "sm" | "default" | "lg"; // Button size
  disabled?: boolean; // Whether button is disabled
  loading?: boolean; // Whether button shows loading state
  icon?: ReactNode; // Icon to display in button
  flex?: boolean; // Whether button should take flex space
  className?: string; // Additional CSS classes
  type?: "button" | "submit"; // Button type
}
```

## Examples

### Basic Modal

```jsx
<GlobalModal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirmation"
  description="Are you sure you want to proceed?"
  actions={[
    { label: "Cancel", variant: "outline", onClick: onClose },
    { label: "Confirm", variant: "default", onClick: onConfirm },
  ]}
>
  <p>This action will make permanent changes to your data.</p>
</GlobalModal>
```

### Form Modal

```jsx
<GlobalModal
  isOpen={isOpen}
  onClose={onClose}
  title="Add User"
  description="Create a new user account"
  headerIcon={<User />}
  size="lg"
  actions={[
    {
      label: "Cancel",
      variant: "outline",
      onClick: onClose,
      flex: true,
    },
    {
      label: isLoading ? "Creating..." : "Create User",
      variant: "default",
      onClick: onSubmit,
      disabled: isLoading || !isFormValid,
      loading: isLoading,
      icon: <UserCheck />,
      flex: true,
    },
  ]}
>
  <form onSubmit={onSubmit}>{/* Form fields */}</form>
</GlobalModal>
```

### Delete Confirmation Modal

```jsx
<GlobalModal
  isOpen={isOpen}
  onClose={onClose}
  title="Confirm Delete"
  headerIcon={<AlertTriangle />}
  headerBg="danger"
  actions={[
    {
      label: "Cancel",
      variant: "outline",
      onClick: onClose,
      flex: true,
    },
    {
      label: "Delete",
      variant: "destructive",
      onClick: onDelete,
      icon: <Trash2 />,
      flex: true,
    },
  ]}
>
  <div className="text-center">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
      <Trash2 className="h-6 w-6 text-red-600" />
    </div>
    <p>This action cannot be undone.</p>
  </div>
</GlobalModal>
```

### Large Modal with Scrollable Content

```jsx
<GlobalModal
  isOpen={isOpen}
  onClose={onClose}
  title="Settings"
  description="Configure your application settings"
  size="2xl"
  actions={[
    { label: "Cancel", variant: "outline", onClick: onClose },
    { label: "Save Changes", variant: "default", onClick: onSave },
  ]}
>
  <div className="space-y-6">
    {/* Long content that will scroll */}
    <div>Section 1 content...</div>
    <div>Section 2 content...</div>
    <div>Section 3 content...</div>
  </div>
</GlobalModal>
```

## Migration from Old Modals

### Before (UserFormModal)

```jsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div
    className="absolute inset-0 bg-black/50 backdrop-blur-sm"
    onClick={handleClose}
  />
  <Card className="relative w-full max-w-md shadow-2xl">
    <CardHeader>
      <CardTitle>Add User</CardTitle>
      <CardDescription>Create a new user account</CardDescription>
    </CardHeader>
    <CardContent>{/* Form content */}</CardContent>
    <div className="p-4 border-t">
      <Button onClick={handleClose}>Cancel</Button>
      <Button onClick={handleSubmit}>Save</Button>
    </div>
  </Card>
</div>
```

### After (GlobalModal)

```jsx
<GlobalModal
  isOpen={isOpen}
  onClose={handleClose}
  title="Add User"
  description="Create a new user account"
  headerIcon={<User />}
  actions={[
    { label: "Cancel", variant: "outline", onClick: handleClose },
    { label: "Save", variant: "default", onClick: handleSubmit },
  ]}
>
  {/* Form content */}
</GlobalModal>
```

## Best Practices

1. **Consistent Actions**: Use `flex: true` for action buttons to ensure they take equal space
2. **Loading States**: Always provide loading states for async operations
3. **Validation**: Disable submit actions when form validation fails
4. **Icons**: Use meaningful icons in headers and buttons to improve UX
5. **Sizes**: Choose appropriate modal sizes based on content complexity
6. **Error Handling**: Include error messages within the modal content area
7. **Accessibility**: Ensure proper focus management and keyboard navigation

## Styling

The modal uses Tailwind CSS classes and can be customized through:

- `headerClassName`: Style the header area
- `contentClassName`: Style the content area
- `footerClassName`: Style the footer area
- Action button `className`: Style individual buttons

## Dependencies

- React
- Lucide React (for icons)
- Tailwind CSS
- Button component from UI library
