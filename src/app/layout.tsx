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
      </head>
      <body 
        className={`${merriweather.variable} ${sourceSans.variable} ${sourceCode.variable} antialiased min-h-screen`}
        suppressHydrationWarning
      >
        {children}
        <footer className="py-4 text-center text-sm text-gray-600 border-t border-gray-200 mt-8">
          <p>An open source app by <a href="https://www.silv.app" target="_blank" rel="noopener" className="text-blue-600">silv.app</a></p>
        </footer>
      </body>
    </html>
  );
}
