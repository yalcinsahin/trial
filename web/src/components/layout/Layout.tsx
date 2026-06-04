import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  headerTransparent?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  hideHeader = false,
  hideFooter = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-warm-white">
      {!hideHeader && <Header />}
      <main className={['flex-1', !hideHeader ? 'pt-16 lg:pt-20' : ''].filter(Boolean).join(' ')}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
