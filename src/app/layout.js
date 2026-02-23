import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Solventum Ortho Portal',
  description: 'Solventum Ortho Portal powered by viax',
  icons: {
    icon: [
      { url: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style>{`
          :root {
            --font-heading: "Solve Pro", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, Helvetica, sans-serif;
            --font-body: "Solve Pro", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, Helvetica, sans-serif;
          }
        `}</style>
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
