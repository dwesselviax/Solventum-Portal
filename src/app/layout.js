import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Solventum Ortho Portal',
  description: 'Solventum Ortho Portal powered by viax',
  icons: { icon: (process.env.NEXT_PUBLIC_BASE_PATH || '') + '/solventum-logo.svg' },
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
