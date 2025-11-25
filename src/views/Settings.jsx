import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { User, MapPin, GitBranch, Package, Shield } from 'lucide-react';

// Import tab components (will create these next)
import ProfileTab from '../components/settings/ProfileTab';
import GeographyTab from '../components/settings/GeographyTab';
import LeadStagesTab from '../components/settings/LeadStagesTab';
import ProductsTab from '../components/settings/ProductsTab';
import RolesPermissionsTab from '../components/settings/RolesPermissionsTab';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      component: ProfileTab,
    },
    {
      id: 'geography',
      label: 'Geography',
      icon: MapPin,
      component: GeographyTab,
    },
    {
      id: 'lead-stages',
      label: 'Lead Stages',
      icon: GitBranch,
      component: LeadStagesTab,
    },
    {
      id: 'products-categories',
      label: 'Products & Categories',
      icon: Package,
      component: ProductsTab,
    },
    {
      id: 'roles-permissions',
      label: 'Roles & Permissions',
      icon: Shield,
      component: RolesPermissionsTab,
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in px-2 sm:px-0">
      {/* Page Header */}
      <div className="text-center sm:text-left">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your application settings and configurations</p>
      </div>
      {/* Settings Tabs */}
      {/* this is dummy */}
      <Card className="card-enhanced shadow-sm">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50">
              <div className="px-0.5 sm:px-4 lg:px-6 py-1.5 sm:py-4">
                <TabsList className="w-full bg-white/50 backdrop-blur-sm p-0.5 sm:p-1 h-auto">
                  <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-0.5 sm:gap-1 w-full">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <TabsTrigger
                          key={tab.id}
                          value={tab.id}
                          className="flex flex-col items-center justify-center gap-0.5 sm:gap-2 px-1 sm:px-2 md:px-3 lg:px-4 py-1 sm:py-2.5 text-[9px] sm:text-sm font-medium transition-all duration-200 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-white/80 flex-1 sm:flex-initial min-w-0"
                        >
                          <Icon className="h-2.5 w-2.5 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-center leading-tight truncate w-full">
                            <span className="hidden md:inline">{tab.label}</span>
                            <span className="md:hidden leading-[10px]">
                              {tab.id === 'products-categories'
                                ? 'Products'
                                : tab.id === 'roles-permissions'
                                ? 'Roles'
                                : tab.id === 'lead-stages'
                                ? 'Stages'
                                : tab.label}
                            </span>
                          </span>
                        </TabsTrigger>
                      );
                    })}
                  </div>
                </TabsList>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-3 sm:p-4 lg:p-6">
              {tabs.map((tab) => {
                const TabComponent = tab.component;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-gray-100">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
                          <tab.icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h2 className="section-title truncate">{tab.label}</h2>
                          <p className="section-subtitle">
                            Configure {tab.label.toLowerCase()} settings
                          </p>
                        </div>
                      </div>
                      <div className="w-full overflow-hidden">
                        <TabComponent />
                      </div>
                    </div>
                  </TabsContent>
                );
              })}
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
