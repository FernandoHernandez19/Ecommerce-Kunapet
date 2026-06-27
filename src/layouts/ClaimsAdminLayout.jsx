import React from 'react';
import AdminSidebar from '../components/Claims/AdminSidebar';

export default function ClaimsAdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#FDFDFD] font-sans">
      <AdminSidebar />
      <main className="flex-1 ml-64 p-8 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}