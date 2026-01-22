'use client';

import { notFound, usePathname } from 'next/navigation';
import { isValidLanguage, type Language } from '@/i18n/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface LayoutProps {
  children: React.ReactNode;
  params: { lang: string };
}

export default function LanguageLayout({ children, params }: LayoutProps) {
  const pathname = usePathname();
  
  // Validate the language parameter
  if (!isValidLanguage(params.lang)) {
    notFound();
  }

  const lang = params.lang as Language;
  
  // Check if we're on the select page - no header/footer
  const isSelectPage = pathname?.includes('/select');

  if (isSelectPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header lang={lang} />
      <main className="flex-1">
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
