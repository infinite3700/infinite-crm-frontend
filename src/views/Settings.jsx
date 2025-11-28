import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { selectCurrentUser } from '../store/authSlice';
import { hasPermission } from '../utils/permissions';
import { SETTINGS_TABS, getAccessibleSettingsTabs } from '../config/navigation';

// Import tab components
import ProfileTab from '../components/settings/ProfileTab';
import GeographyTab from '../components/settings/GeographyTab';
import LeadStagesTab from '../components/settings/LeadStagesTab';
import ProductsTab from '../components/settings/ProductsTab';
import RolesPermissionsTab from '../components/settings/RolesPermissionsTab';

// Component mapping
const TAB_COMPONENTS = {
  profile: ProfileTab,
  geography: GeographyTab,
  'lead-stages': LeadStagesTab,
  'products-categories': ProductsTab,
  'roles-permissions': RolesPermissionsTab,
};

const Settings = () => {
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('profile');

  // Get accessible tabs for current user using centralized config
  const tabs = getAccessibleSettingsTabs(currentUser, hasPermission);

  // Set default active tab to first accessible tab
  useEffect(() => {
    if (tabs.length > 0 && !tabs.find((tab) => tab.id === activeTab)) {
      setActiveTab(tabs[0].id);
    }
  }, [tabs, activeTab]);

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
                            <span className="md:hidden leading-[10px]">{tab.shortLabel}</span>
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
                const TabComponent = TAB_COMPONENTS[tab.id];
                const Icon = tab.icon;
                return (
                  <TabsContent key={tab.id} value={tab.id} className="mt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b border-gray-100">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex-shrink-0">
                          <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
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
