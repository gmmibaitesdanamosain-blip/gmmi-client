import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from "@heroui/react";
import { Menu } from 'lucide-react';
import Sidebar from '../components/partials/Sidebar';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          role="admin"
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full relative">
          {/* Mobile Menu Toggle */}
          <div className="lg:hidden mb-6">
            <Button
              isIconOnly
              variant="flat"
              className="bg-white/50 backdrop-blur-md shadow-sm"
              onPress={() => setIsSidebarOpen(true)}
            >
              <Menu className="text-gmmi-navy w-6 h-6" />
            </Button>
          </div>

          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 ease-soft">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;