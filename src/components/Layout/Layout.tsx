import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 text-xl font-bold shadow">
        Market Seasonality Explorer
      </header>
      <main className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default Layout; 