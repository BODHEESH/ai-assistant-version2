import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';
import { metadata } from './metadata';

const inter = Inter({ subsets: ['latin'] });

function RootLayoutClient({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}

export { metadata };

export default function RootLayout({ children }) {
  return <RootLayoutClient>{children}</RootLayoutClient>;
}