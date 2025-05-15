import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { ReduxProvider } from '@/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'T1 Envíos - Dashboard Ejecutivo',
  description: 'Dashboard ejecutivo para T1 Envíos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeRegistry>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}