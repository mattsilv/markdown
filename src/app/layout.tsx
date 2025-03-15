import type { Metadata } from "next";
import { Merriweather, Source_Sans_3, Source_Code_Pro } from "next/font/google";
import "./globals.css";

const merriweather = Merriweather({
  weight: ['300', '400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--heading-font',
});

const sourceSans = Source_Sans_3({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--body-font',
});

const sourceCode = Source_Code_Pro({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--code-font',
});

export const metadata: Metadata = {
  title: "Markdown Report Generator",
  description: "Convert Markdown to print-friendly format with enhanced tables and footnotes",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Explicitly setting data-theme to light to avoid dark mode
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta httpEquiv="Cache-Control" content="max-age=0" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body 
        className={`${merriweather.variable} ${sourceSans.variable} ${sourceCode.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
