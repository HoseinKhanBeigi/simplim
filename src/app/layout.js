import './globals.css'
import { Inter } from 'next/font/google';
import AuthProvider from './providers/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Simplim',
  description: 'Your PDF Management Solution',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
} 