import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../store/authSlice';
import { leadService } from '../api/leadService';
import { 
  Menu, 
  Home, 
  Users, 
  Settings, 
  LogOut,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  User,
  Megaphone,
  PhoneCall
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../components/ui/sheet';

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const currentUser = useSelector(selectCurrentUser);
  const [leadCounts, setLeadCounts] = useState({ assignedCount: 0, followUpCount: 0 });

  // Desktop/Tablet navigation (without Follow Up)
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Users', href: '/users', icon: Users },
    { name: 'Leads', href: '/leads', icon: UserCheck },
    { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  // Mobile navigation (with Follow Up)
  const mobileNavigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Leads', href: '/leads', icon: UserCheck },
    { name: 'Follow Up', href: '/leads/follow-up', icon: PhoneCall },
    { name: 'Campaigns', href: '/campaigns', icon: Megaphone },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Fetch lead counts
  useEffect(() => {
    const fetchLeadCounts = async () => {
      const counts = await leadService.getLeadCounts();
      setLeadCounts(counts);
    };
    
    fetchLeadCounts();
    
    // Refresh counts every 30 seconds
    const interval = setInterval(fetchLeadCounts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center px-4 border-b">
        <h1 className="section-title">Admin Panel</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors
                ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }
              `}
            >
              <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Menu */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8 bg-gradient-primary">
              <AvatarFallback className="text-white">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-foreground">
              {currentUser ? currentUser.name : 'Admin User'}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentUser ? currentUser.email : 'admin@example.com'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-colors"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const MobileSidebarContent = () => (
    <div className="flex h-full flex-col min-h-[calc(100vh-2rem)]">
      {/* Logo Section */}
      <div className="flex items-center justify-center py-4 px-4 border-b border-gray-200/50">
        <div className="text-center">
          <h1 className="page-title leading-tight">
            Admin Panel
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Management System</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                group flex items-center rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 min-h-[44px]
                ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
                }
              `}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-md mr-3 flex-shrink-0
                ${active 
                  ? 'bg-white/20' 
                  : 'bg-gray-100 group-hover:bg-gray-200'
                }
                transition-all duration-200
              `}>
                <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-gray-600 group-hover:text-gray-800'}`} />
              </div>
              <span className="flex-1 truncate">{item.name}</span>
              {active && (
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout Section - Fixed at bottom */}
      <div className="border-t border-gray-200/50 bg-gray-50/50 p-3 mt-auto">
        <div className="flex items-center space-x-3 mb-3">
          <div className="flex-shrink-0">
            <Avatar className="h-10 w-10 border-2 border-white shadow-md bg-gradient-to-r from-blue-500 to-purple-600">
              <AvatarFallback className="text-white font-semibold text-sm">
                {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {currentUser ? currentUser.name : 'Admin User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {currentUser ? currentUser.email : 'admin@example.com'}
            </p>
          </div>
        </div>
        
        {/* Logout Button */}
        <Button 
          variant="outline" 
          size="sm"
          className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 transition-all duration-200 text-sm h-9"
          onClick={() => {
            handleLogout();
            setSidebarOpen(false);
          }}
        >
          <LogOut className="mr-2 h-3.5 w-3.5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <Card className="flex h-full flex-col rounded-none border-r border-l-0 border-t-0 border-b-0">
          <SidebarContent />
        </Card>
      </div>

      {/* Mobile Sidebar - only for tablets */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent 
          side="left" 
          className="p-0 w-80 sm:max-w-80 bg-white border-r border-gray-200/50 sm:block hidden"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <MobileSidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-background border-b">
          <div className="flex h-14 sm:h-16 items-center justify-between px-3 sm:px-6">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Mobile menu button - only for tablets */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex md:hidden h-9 w-9"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sr-only">Open sidebar</span>
              </Button>

              {/* Mobile App Title */}
              <div className="sm:hidden">
                <h1 className="text-lg font-semibold text-foreground">Admin Panel</h1>
              </div>

              {/* Search */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 w-48 lg:w-64 bg-muted border-0 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Notifications */}
              {/* <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 sm:h-4 sm:w-4 rounded-full bg-destructive text-xs text-destructive-foreground flex items-center justify-center">
                  3
                </span>
              </Button> */}

              {/* User Avatar - Desktop and Tablet */}
              <div className="hidden sm:flex items-center space-x-3 relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-8 w-8 bg-gradient-primary">
                    <AvatarFallback className="text-white text-sm">
                      {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium">
                      {currentUser ? currentUser.name : 'Admin User'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {currentUser ? currentUser.email : 'admin@example.com'}
                    </p>
                  </div>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Desktop/Tablet User Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-12 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 bg-gradient-primary">
                            <AvatarFallback className="text-white text-sm">
                              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {currentUser ? currentUser.name : 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser ? currentUser.email : 'admin@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            // Add profile navigation here if needed
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400" />
                          Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile User Avatar */}
              <div className="sm:hidden relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Avatar className="h-8 w-8 bg-gradient-primary">
                    <AvatarFallback className="text-white text-sm">
                      {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className={`h-3 w-3 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile User Dropdown */}
                {userMenuOpen && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-12 z-50 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 bg-gradient-primary">
                            <AvatarFallback className="text-white text-sm">
                              {currentUser ? currentUser.name.charAt(0).toUpperCase() : 'AU'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {currentUser ? currentUser.name : 'Admin User'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser ? currentUser.email : 'admin@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            // Add profile navigation here if needed
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          <User className="h-4 w-4 mr-3 text-gray-400" />
                          Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            setUserMenuOpen(false);
                            handleLogout();
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-muted/30 pb-16 sm:pb-0">
          <div className="container mx-auto px-3 py-4 sm:px-6 sm:py-6 max-w-7xl">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/50 pb-safe shadow-lg">
          <div className="grid grid-cols-5 h-14">
            {mobileNavigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              // Get count for Leads and Follow Up items
              let count = null;
              if (item.href === '/leads') {
                count = leadCounts.assignedCount;
              } else if (item.href === '/leads/follow-up') {
                count = leadCounts.followUpCount;
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex flex-col items-center justify-center h-full px-1 py-1.5 transition-all duration-300 ease-out relative
                    ${
                      active
                        ? 'text-blue-600'
                        : 'text-gray-500 hover:text-gray-700 active:text-blue-500'
                    }
                  `}
                >
                  {/* Active background pill */}
                  {active && (
                    <div className="absolute inset-x-1 inset-y-1.5 bg-blue-50 rounded-xl transition-all duration-300 ease-out" />
                  )}
                  
                  <div className={`
                    flex items-center justify-center relative z-10 transition-all duration-300 ease-out
                    ${active ? 'scale-105 -translate-y-0.5' : 'scale-100'}
                  `}>
                    <Icon className={`h-4 w-4 transition-colors duration-300 ${
                      active ? 'text-blue-600' : 'text-gray-500'
                    }`} />
                    
                    {/* Count Badge */}
                    {count > 0 && (
                      <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full">
                        {count > 99 ? '99+' : count}
                      </span>
                    )}
                  </div>
                  
                  <span className={`
                    text-[10px] font-medium leading-tight mt-0.5 relative z-10 transition-all duration-300
                    ${active ? 'text-blue-600 font-semibold' : 'text-gray-500'}
                  `}>
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;