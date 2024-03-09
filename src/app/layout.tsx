import type {Metadata} from "next";
import {Inter} from "next/font/google";
import React from "react";
import CssBaseline from '@mui/material/CssBaseline';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Railways Graphical Time Table",
  description: "An app to visualize graphical time table for railways on Germany",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <CssBaseline />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

