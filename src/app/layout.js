import './globals.css'

export const metadata = {
  title: 'simplim',
  description: 'A PDF viewer with highlighting capabilities',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 