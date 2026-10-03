"use client";

import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { RadioPlayerProvider } from "./_components/radio-player-context";
import { RadioMiniBar } from "./_components/radio-mini-bar";

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="dark" enableSystem={false}>
      <SessionProvider>
        <RadioPlayerProvider>
          {children}
          <div className="h-14" aria-hidden="true" />
          <RadioMiniBar />
        </RadioPlayerProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}
