import { Outlet, useLocation } from 'react-router';
import { useEffect } from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { Navigation } from './Navigation';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [location.pathname]);

  return null;
}

export function Root() {
  return (
    <LanguageProvider>
      <ScrollToTop />
      
      {/* النافبار يظهر بكل الصفحات */}
      <Navigation />

      {/* المحتوى */}
      <Outlet />
    </LanguageProvider>
  );
}
