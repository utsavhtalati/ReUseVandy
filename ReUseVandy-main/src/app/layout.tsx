"use client";
import { usePathname, useRouter } from "next/navigation";
import { MantineProvider, AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import "./globals.css";
import { useEffect } from "react";
import { AuthProvider } from "./lib/contexts";
import '@mantine/core/styles.css';

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <title>ReUse Vandy</title>

      </head>
      <body>
        <AuthProvider>
          <MantineProvider >
            {children}
          </MantineProvider>
        </AuthProvider>
      </body>
    </html >

  );
}
