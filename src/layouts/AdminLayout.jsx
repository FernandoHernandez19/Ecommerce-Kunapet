import React from 'react';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopNav from '../components/Admin/AdminTopNav';

export default function AdminLayout({ children, adminName, avatarUrl }) {
  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans text-gray-800">
      <AdminSidebar />
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <AdminTopNav adminName={adminName} avatarUrl={avatarUrl} />
        <main className="flex-1 p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}