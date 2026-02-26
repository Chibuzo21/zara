import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "../../ConvexClientProvider";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import Navigation from "../../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zara's Delight Bakery - Management System",
  description: "Complete management system for bakery operations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ConvexClientProvider>
            {/* <AuthProvider> */}
            <div className='min-h-screen bg-gray-50'>
              <Navigation />
              <main className='container mx-auto px-4 py-8'>{children}</main>
            </div>
            {/* </AuthProvider> */}
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
