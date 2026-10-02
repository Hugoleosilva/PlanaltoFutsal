"use client";

import { SessionProvider } from "next-auth/react";
import { RadioPlayerProvider } from "./_components/radio-player-context";
import { RadioMiniBar } from "./_components/radio-mini-bar";

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <SessionProvider>
      <RadioPlayerProvider>
        {children}
        <div className="h-14" aria-hidden="true" />
        <RadioMiniBar />
      </RadioPlayerProvider>
    </SessionProvider>
  );
}
