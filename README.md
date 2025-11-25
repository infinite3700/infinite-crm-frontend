# React Admin Panel

A modern, responsive admin panel built with React 18, Vite, Redux Toolkit, and shadcn/ui components.

## ✨ Features

- **Modern Tech Stack**: React 18, Vite, Redux Toolkit, React Router v6
- **Beautiful UI**: shadcn/ui components with Tailwind CSS
- **Responsive Design**: Mobile-first responsive layout with collapsible sidebar
- **State Management**: Redux Toolkit for efficient state management
- **API Integration**: Axios for API calls with interceptors
- **Protected Routes**: Authentication-based route protection
- **MVC Architecture**: Well-organized folder structure

## 🚀 Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+ (recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── api/              # API service files (Model)
│   └── userService.js
├── components/       # Reusable UI components (View)
│   └── ui/          # shadcn/ui components
├── layouts/         # Layout wrappers
│   └── AdminLayout.jsx
├── lib/            # Utility functions
│   └── utils.js
├── routes/         # Centralized routing setup
│   └── AppRouter.jsx
├── store/          # Redux Toolkit slices and store (Model/State)
│   ├── index.js
│   └── userSlice.js
├── views/          # Page components (Controller + View)
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Users.jsx
├── App.jsx         # Main app component
└── main.jsx        # App entry point
```

## 🔐 Authentication

The application includes a simple authentication system:

- **Login Page**: Accessible at `/login`
- **Demo Credentials**: Any email and password combination works
- **Protected Routes**: All admin routes require authentication
- **Token Storage**: Uses localStorage for token persistence

## 📱 Responsive Features

### Desktop (≥768px)

- Full sidebar navigation visible
- Complete table view for users
- Extended search and filter options

### Mobile & Tablet (<768px)

- Collapsible hamburger menu
- Card-based user display
- Touch-friendly interface
- Optimized navigation

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 UI Components

Built using shadcn/ui components for consistency and beauty:

- **Cards**: For content containers
- **Tables**: Responsive data tables
- **Buttons**: Various button styles and sizes
- **Forms**: Input fields and form controls
- **Navigation**: Sidebar and mobile menu
- **Layout**: Grid and flexbox layouts

## 🔄 State Management

Redux Toolkit is used for state management with the following structure:

- **Store Configuration**: `src/store/index.js`
- **User Slice**: `src/store/userSlice.js`
  - User CRUD operations
  - Loading and error states
  - Async thunks for API calls

## 🌐 API Integration

- **Base Service**: `src/api/userService.js`
- **JSONPlaceholder API**: Used for demo user data
- **Axios Interceptors**: Request/response handling
- **Error Handling**: Comprehensive error management

## 📄 Pages

### Dashboard (`/`)

- Statistics cards
- Recent activity feed
- Quick action buttons
- Overview metrics

### Users (`/users`)

- User list with search functionality
- Responsive table/card view
- User details and actions
- Real-time data from API

### Login (`/login`)

- Clean login form
- Demo credentials info
- Form validation
- Responsive design

## 🎯 Key Features

1. **Responsive Sidebar**: Collapses to hamburger menu on mobile
2. **Real API Integration**: Fetches users from JSONPlaceholder
3. **Search Functionality**: Filter users by name, email, or phone
4. **Loading States**: Proper loading indicators
5. **Error Handling**: User-friendly error messages
6. **Clean Architecture**: MVC-like organization
7. **Modern UI**: shadcn/ui with Tailwind CSS
8. **Protected Routes**: Authentication-based navigation

## 🚧 Future Enhancements

- [ ] Dark mode toggle
- [ ] User CRUD operations
- [ ] Advanced filtering and sorting
- [ ] Pagination for large datasets
- [ ] Real authentication backend
- [ ] Role-based permissions
- [ ] Settings page functionality
- [ ] Data export features+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# infinite-frontend
# infinite-crm-frontend
# infinite-crm-frontend
