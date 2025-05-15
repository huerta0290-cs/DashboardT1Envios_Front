// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReduxProvider } from '@/redux/provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'T1 Envíos - Dashboard Ejecutivo',
  description: 'Dashboard ejecutivo para visualización de métricas de T1 Envíos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
          <ReduxProvider>
            {children}
          </ReduxProvider>
      </body>
    </html>
  );
}


